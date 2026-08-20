/**
 * SINGLE ENTRY POINT for loading a football database.
 *
 * The engine never touches `FootballDatabase` (the normalized/authored
 * shape) directly — it only ever sees the flat runtime `Club[]` / `League[]`
 * shapes from `src/types.ts`, exactly as it did before this refactor.
 *
 * This is what makes the engine database-agnostic: swapping `'2026_27'` for
 * a future `'1999_00'` historical database, or a Continental DLC database,
 * requires zero engine or component changes — only a new entry in
 * `AVAILABLE_DATABASES` below.
 */
import { Club, League, Owner, MultiClubGroup } from '../types';
import { FootballDatabase, ClubRecord, LeagueRecord } from './types/database';
import { validateDatabase } from './validation/validateDatabase';
import { computeClubOverall } from './utilities/rating';
import { DATABASE_REGISTRY, DEFAULT_DATABASE_ID } from './databases/registry';

export interface LoadedDatabase {
  databaseId: string;
  databaseVersion: string;
  leagues: League[];
  clubs: Club[];
  multiClubGroups: MultiClubGroup[];
}

function materializeLeague(record: LeagueRecord, db: FootballDatabase): League {
  const country = db.countries.find(c => c.id === record.countryId);
  return {
    id: record.id,
    name: record.name,
    country: country ? country.name : record.countryId,
    tier: record.tier,
    rep: record.rep,
    promotionTo: record.promotionTo,
    relegationTo: record.relegationTo,
  };
}

function materializeClub(record: ClubRecord, db: FootballDatabase): Club {
  const ownerEntity = record.ownerEntityId ? db.ownerEntities.find(o => o.id === record.ownerEntityId) : undefined;
  const owner: Owner | undefined = ownerEntity
    ? {
        id: ownerEntity.id,
        name: ownerEntity.name,
        personality: ownerEntity.personality ?? 'BUSINESS_OWNER',
        patience: ownerEntity.patience ?? 6,
        spendingPower: ownerEntity.spendingPower ?? 5,
        age: ownerEntity.age ?? 55,
      }
    : undefined;

  return {
    id: record.id,
    name: record.name,
    leagueId: record.leagueId,
    rating: computeClubOverall(record.attributes),
    color: record.colors.primary,
    secondaryColor: record.colors.secondary,
    philosophy: record.philosophy,
    stadium: record.stadium,
    finances: record.attributes.finances,
    owner,
    rivals: record.rivals,
    multiClubGroupId: record.groupId,
    historicalPeak: record.historicalPeak,
    historicalTrough: record.historicalTrough,
  };
}

function materializeMultiClubGroups(db: FootballDatabase): MultiClubGroup[] {
  return db.ownerEntities
    .filter(o => o.type === 'MULTI_CLUB_GROUP')
    .map(o => ({ id: o.id, name: o.name, clubIds: o.clubIds }));
}

/**
 * Loads a database by ID (defaults to the current season), validates it,
 * and returns the materialized runtime shape. Validation warnings/errors
 * are logged with the database ID so they're traceable when more databases
 * exist in future (Historical DLC, Continental DLC, etc.).
 */
export function loadDatabase(databaseId: string = DEFAULT_DATABASE_ID): LoadedDatabase {
  const db = DATABASE_REGISTRY[databaseId];
  if (!db) {
    throw new Error(`[databaseLoader] Unknown database ID "${databaseId}". Installed: ${Object.keys(DATABASE_REGISTRY).join(', ')}`);
  }

  const result = validateDatabase(db);
  const errors = result.issues.filter(i => i.severity === 'ERROR');
  const warnings = result.issues.filter(i => i.severity === 'WARNING');

  if (warnings.length > 0) {
    console.warn(`[databaseLoader] Database "${databaseId}" loaded with ${warnings.length} warning(s):`);
    warnings.forEach(w => console.warn(`  [${w.code}] ${w.message}`));
  }
  if (errors.length > 0) {
    console.error(`[databaseLoader] Database "${databaseId}" has ${errors.length} ERROR(S):`);
    errors.forEach(e => console.error(`  [${e.code}] ${e.message}`));
    throw new Error(`[databaseLoader] Database "${databaseId}" failed validation with ${errors.length} error(s). See console for details.`);
  }

  return {
    databaseId,
    databaseVersion: db.manifest.version,
    leagues: db.leagues.map(l => materializeLeague(l, db)),
    clubs: db.clubs.map(c => materializeClub(c, db)),
    multiClubGroups: materializeMultiClubGroups(db),
  };
}
