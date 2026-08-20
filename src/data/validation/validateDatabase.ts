import { FootballDatabase, ValidationIssue, ValidationResult } from '../types/database';

/**
 * Validates a FootballDatabase for structural integrity before it's loaded
 * into the game. Catches the class of bugs that silently corrupted the old
 * flat database (e.g. a club assigned to a league from the wrong country,
 * or a multi-club group referencing a club that was never defined).
 *
 * Design note: rivalries and multi-club-group members are allowed to
 * reference clubs that don't exist YET in a partially-populated database
 * (that's expected during incremental content build-out) — those come back
 * as WARNINGs, not ERRORs, so a database can still be loaded and iterated on.
 * Duplicate IDs and broken league/country/owner references are ERRORs,
 * because those indicate real corruption, not incomplete content.
 */
export function validateDatabase(db: FootballDatabase): ValidationResult {
  const issues: ValidationIssue[] = [];
  const err = (code: string, message: string) => issues.push({ severity: 'ERROR', code, message });
  const warn = (code: string, message: string) => issues.push({ severity: 'WARNING', code, message });

  const countryIds = new Set(db.countries.map(c => c.id));
  const leagueIds = new Set(db.leagues.map(l => l.id));
  const clubIds = new Set(db.clubs.map(c => c.id));
  const ownerIds = new Set(db.ownerEntities.map(o => o.id));

  // --- Duplicate IDs ---
  checkDuplicates(db.countries.map(c => c.id), 'DUPLICATE_COUNTRY_ID', err);
  checkDuplicates(db.leagues.map(l => l.id), 'DUPLICATE_LEAGUE_ID', err);
  checkDuplicates(db.clubs.map(c => c.id), 'DUPLICATE_CLUB_ID', err);
  checkDuplicates(db.ownerEntities.map(o => o.id), 'DUPLICATE_OWNER_ID', err);
  checkDuplicates(db.competitions.map(c => c.id), 'DUPLICATE_COMPETITION_ID', err);

  // --- Leagues: broken country references, self-referencing promotion/relegation ---
  for (const league of db.leagues) {
    if (!countryIds.has(league.countryId)) {
      err('BROKEN_LEAGUE_COUNTRY_REF', `League "${league.id}" references unknown country "${league.countryId}".`);
    }
    if (league.promotionTo && !leagueIds.has(league.promotionTo)) {
      err('BROKEN_PROMOTION_REF', `League "${league.id}" promotes into unknown league "${league.promotionTo}".`);
    }
    if (league.relegationTo && !leagueIds.has(league.relegationTo)) {
      err('BROKEN_RELEGATION_REF', `League "${league.id}" relegates into unknown league "${league.relegationTo}".`);
    }
  }

  // --- Clubs: broken league/country/owner refs, cross-country league mismatches, missing fields ---
  const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
  for (const club of db.clubs) {
    if (!club.name) err('MISSING_CLUB_NAME', `Club "${club.id}" is missing a name.`);
    if (!club.attributes) {
      err('MISSING_CLUB_ATTRIBUTES', `Club "${club.id}" has no attributes — overall rating cannot be calculated.`);
    } else {
      for (const [key, value] of Object.entries(club.attributes)) {
        if (typeof value !== 'number' || value < 1 || value > 99 || Number.isNaN(value)) {
          err('INVALID_RATING_VALUE', `Club "${club.id}" (${club.name}) has an out-of-range ${key} value: ${value}. Expected 1-99.`);
        }
      }
    }
    if (club.ambition !== undefined && (club.ambition < 1 || club.ambition > 99)) {
      err('INVALID_RATING_VALUE', `Club "${club.id}" (${club.name}) has an out-of-range ambition value: ${club.ambition}. Expected 1-99.`);
    }

    // Stadium
    if (!club.stadium) {
      err('MISSING_STADIUM', `Club "${club.id}" (${club.name}) has no stadium name.`);
    }
    if (club.stadiumCapacity !== undefined && (club.stadiumCapacity <= 0 || !Number.isFinite(club.stadiumCapacity))) {
      err('INVALID_STADIUM_CAPACITY', `Club "${club.id}" (${club.name}) has an invalid stadium capacity: ${club.stadiumCapacity}.`);
    }

    // Colours
    if (!club.colors?.primary) {
      err('MISSING_PRIMARY_COLOR', `Club "${club.id}" (${club.name}) has no primary colour.`);
    } else if (!HEX_COLOR.test(club.colors.primary)) {
      err('INVALID_COLOR_FORMAT', `Club "${club.id}" (${club.name}) primary colour "${club.colors.primary}" is not a valid hex colour.`);
    }
    if (club.colors?.secondary && !HEX_COLOR.test(club.colors.secondary)) {
      err('INVALID_COLOR_FORMAT', `Club "${club.id}" (${club.name}) secondary colour "${club.colors.secondary}" is not a valid hex colour.`);
    }

    const league = db.leagues.find(l => l.id === club.leagueId);
    if (!league) {
      err('BROKEN_CLUB_LEAGUE_REF', `Club "${club.id}" (${club.name}) references unknown league "${club.leagueId}".`);
    } else if (league.countryId !== club.countryId) {
      err(
        'CLUB_COUNTRY_LEAGUE_MISMATCH',
        `Club "${club.id}" (${club.name}) is assigned countryId "${club.countryId}" but its league "${league.id}" belongs to country "${league.countryId}".`
      );
    }

    if (!countryIds.has(club.countryId)) {
      err('BROKEN_CLUB_COUNTRY_REF', `Club "${club.id}" (${club.name}) references unknown country "${club.countryId}".`);
    }

    if (club.ownerEntityId && !ownerIds.has(club.ownerEntityId)) {
      err('BROKEN_OWNER_REF', `Club "${club.id}" (${club.name}) references unknown owner entity "${club.ownerEntityId}".`);
    }
    if (club.groupId && !ownerIds.has(club.groupId)) {
      err('BROKEN_GROUP_REF', `Club "${club.id}" (${club.name}) references unknown owner group "${club.groupId}".`);
    }

    for (const rivalId of club.rivals ?? []) {
      if (!clubIds.has(rivalId)) {
        warn('DANGLING_RIVAL_REF', `Club "${club.id}" (${club.name}) lists rival "${rivalId}", which is not yet defined in this database.`);
      }
    }
  }

  // --- Owner entities: broken club references ---
  for (const owner of db.ownerEntities) {
    for (const cid of owner.clubIds) {
      if (!clubIds.has(cid)) {
        warn('DANGLING_OWNER_CLUB_REF', `Owner entity "${owner.id}" (${owner.name}) references club "${cid}", which is not yet defined in this database.`);
      }
    }
  }

  // --- Competitions: broken league/country references, rule consistency ---
  for (const comp of db.competitions) {
    if (comp.leagueId && !leagueIds.has(comp.leagueId)) {
      err('BROKEN_COMPETITION_LEAGUE_REF', `Competition "${comp.id}" references unknown league "${comp.leagueId}".`);
    }
    if (comp.countryId && !countryIds.has(comp.countryId)) {
      err('BROKEN_COMPETITION_COUNTRY_REF', `Competition "${comp.id}" references unknown country "${comp.countryId}".`);
    }
    if (comp.type === 'DOMESTIC_LEAGUE' && comp.leagueId) {
      const league = db.leagues.find(l => l.id === comp.leagueId);
      if (league) {
        if (league.promotionTo && !comp.promotionRule) {
          warn('COMPETITION_RULE_GAP', `Competition "${comp.id}" is for a league with a promotion target but has no promotionRule text.`);
        }
        if (league.relegationTo && !comp.relegationRule) {
          warn('COMPETITION_RULE_GAP', `Competition "${comp.id}" is for a league with a relegation target but has no relegationRule text.`);
        }
      }
    }
    if (!comp.qualificationRule) {
      warn('COMPETITION_RULE_GAP', `Competition "${comp.id}" (${comp.name}) has no qualificationRule — participant determination is undefined.`);
    }
  }

  return { valid: issues.every(i => i.severity !== 'ERROR'), issues };
}

function checkDuplicates(ids: string[], code: string, err: (code: string, msg: string) => void) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) err(code, `Duplicate ID detected: "${id}".`);
    seen.add(id);
  }
}
