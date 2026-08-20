import {
  Player,
  HiddenTrait,
  TransferOffer,
  Superstar,
  Club,
  League,
  TimelineEntry,
  WorldHeadlinePackage,
  QuickFireSummaryData,
  SeasonRecord
} from '../types';
import { getClubByName, generateClubOffers, LEAGUES_2026, evolveWorldClubsAndOwners } from '../data/database2026';
import { checkWonderkidCrossroads } from '../data/events';
import { simulateInternationalDuty, IntSimResult } from '../data/international';
import { addTimelineEntry } from '../data/timeline';
import {
  calculateBallonDor,
  calculateGoldenShoe,
  getMediaVerdict,
  advanceSuperstars,
  INITIAL_SUPERSTARS
} from '../data/awards';
import { setWorldFeed } from '../data/world';

export const ALL_HIDDEN_TRAITS: HiddenTrait[] = [
  'LOYAL',
  'AMBITIOUS',
  'MONEY_MOTIVATED',
  'HOMEBODY',
  'JOURNEYMAN',
  'BIG_MATCH_PLAYER',
  'RISK_TAKER',
  'ACADEMY_HERO',
  'LEGEND_BUILDER',
  'TROPHY_HUNTER',
  'UNDERDOG',
  'LATE_EXPLORER',
  'LEADER',
  'MERCENARY',
  'FAN_FAVOURITE',
  'NATIONAL_HERO',
  'FAMILY_FOCUSED',
  'SETTLED',
  'ADVENTURER'
];

/**
 * Generates between 3 and 6 unique hidden traits for a player.
 */
export function generateHiddenTraits(): HiddenTrait[] {
  const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
  const shuffled = [...ALL_HIDDEN_TRAITS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Helper to get country code or name from league ID (e.g. ENG_1 -> England)
 */
function getCountryFromLeagueId(leagueId: string): string {
  const league = LEAGUES_2026.find(l => l.id === leagueId);
  return league ? league.country : 'England';
}

/**
 * AI Hidden Decision Engine: Chooses a transfer offer based on player's hidden traits + football logic.
 */
export function aiSelectTransferOffer(player: Player, offers: TransferOffer[]): TransferOffer {
  if (!offers || offers.length === 0) {
    const defaultClub = getClubByName(player.club);
    return {
      id: "stay",
      club: defaultClub,
      type: 'STAY',
      label: "RE-SIGN AT CURRENT CLUB",
      tagClass: "tag-perfect",
      contractLength: 1,
      description: `Stay at ${defaultClub.name}.`
    };
  }

  const traits = player.hiddenTraits || [];
  const currentClubObj = getClubByName(player.club);
  const currentNation = getCountryFromLeagueId(currentClubObj.leagueId);

  // Calculate years at current club
  let yearsAtCurrentClub = 0;
  for (let i = player.history.length - 1; i >= 0; i--) {
    if (player.history[i].club.toLowerCase() === player.club.toLowerCase()) {
      yearsAtCurrentClub++;
    } else {
      break;
    }
  }

  let bestOffer = offers[0];
  let highestScore = -9999;

  for (const offer of offers) {
    let score = 0;

    // Base type scores. STAY starts HIGHEST — realistically, most players
    // default to staying unless something meaningfully better appears.
    // Previously STAY (50) scored below TOO_GOOD (65) and PERFECT (60),
    // which structurally biased every neutral player toward leaving each
    // year regardless of traits.
    switch (offer.type) {
      case 'STAY': score += 68; break;
      case 'SISTER_CLUB': score += 50; break;
      case 'TOO_GOOD': score += 52; break;
      case 'PERFECT': score += 48; break;
      case 'LOWER_TIER': score += 28; break;
      case 'LOAN': score += 32; break;
      case 'FORCED_TRANSFER': score += 55; break;
    }

    // Tenure-based settling momentum. A player who just joined should be
    // meaningfully MORE likely to stay next season (realistic "settling
    // in" period), not equally likely to move again immediately — this is
    // what previously produced 1-2-year hops for 20 years straight for
    // any player with even mild move-favoring traits. After several years
    // settled, a gentle rising itch for a new challenge kicks back in, but
    // stays small enough that it nudges rather than forces a move.
    if (offer.type === 'STAY') {
      if (yearsAtCurrentClub <= 1) score += 18;
      else if (yearsAtCurrentClub === 2) score += 10;
      else if (yearsAtCurrentClub >= 7) score -= Math.min(15, (yearsAtCurrentClub - 6) * 3);
    } else {
      if (yearsAtCurrentClub <= 1) score -= 15;
      else if (yearsAtCurrentClub >= 7) score += Math.min(12, (yearsAtCurrentClub - 6) * 2);
    }

    const offerNation = getCountryFromLeagueId(offer.club.leagueId);
    const isSameCountry = offerNation === currentNation;

    // 1. LOYAL / SETTLED / FAMILY_FOCUSED — dampened from +45/-25 to +22/-10.
    // Strong enough to visibly bias toward staying longer, not so strong
    // it makes leaving mathematically impossible for the whole career.
    if (traits.includes('LOYAL') || traits.includes('SETTLED') || traits.includes('FAMILY_FOCUSED')) {
      if (offer.type === 'STAY') score += 22;
      else score -= 10;
    }

    // 2. ACADEMY_HERO
    if (traits.includes('ACADEMY_HERO')) {
      if (player.history.length === 0 || (player.history[0] && player.history[0].club.toLowerCase() === player.club.toLowerCase())) {
        if (offer.type === 'STAY') score += 25;
      }
    }

    // 3. LEGEND_BUILDER
    if (traits.includes('LEGEND_BUILDER')) {
      if (yearsAtCurrentClub >= 3 && offer.type === 'STAY') {
        score += 20;
      }
    }

    // 4. MERCENARY / JOURNEYMAN — dampened from -35/+35 to -16/+16.
    // Still meaningfully more move-prone than average, but no longer an
    // unbreakable guarantee of leaving every single year.
    if (traits.includes('MERCENARY') || traits.includes('JOURNEYMAN')) {
      if (offer.type === 'STAY') score -= 16;
      else score += 16;
    }

    // 5. AMBITIOUS / TROPHY_HUNTER / BIG_MATCH_PLAYER
    if (traits.includes('AMBITIOUS') || traits.includes('TROPHY_HUNTER') || traits.includes('BIG_MATCH_PLAYER')) {
      if (offer.club.rating >= 82 || offer.type === 'TOO_GOOD') score += 22;
      if (offer.type === 'LOWER_TIER') score -= 18;
    }

    // 6. HOMEBODY
    if (traits.includes('HOMEBODY')) {
      if (isSameCountry) score += 18;
      else score -= 22;
    }

    // 7. RISK_TAKER / ADVENTURER
    if (traits.includes('RISK_TAKER') || traits.includes('ADVENTURER')) {
      if (!isSameCountry) score += 20;
    }

    // 8. LATE_EXPLORER
    if (traits.includes('LATE_EXPLORER') && player.age >= 28) {
      if (!isSameCountry) score += 22;
    }

    // 9. UNDERDOG
    if (traits.includes('UNDERDOG')) {
      if (offer.club.rating < 78 || offer.type === 'LOWER_TIER') score += 20;
      if (offer.club.rating >= 86) score -= 12;
    }

    // 10. MONEY_MOTIVATED
    if (traits.includes('MONEY_MOTIVATED')) {
      const spendingPower = offer.club.owner?.spendingPower || 5;
      score += spendingPower * 3;
    }

    // Random variance noise, widened from ±10 to ±18 now that the
    // deterministic gaps above are smaller — this is what actually lets
    // different careers unfold differently across playthroughs instead of
    // the trait math alone deciding every outcome.
    score += (Math.random() * 36 - 18);

    if (score > highestScore) {
      highestScore = score;
      bestOffer = offer;
    }
  }

  return bestOffer;
}

/**
 * Per-competition trophy probabilities for a given club rating. Rolled
 * INDEPENDENTLY per competition (not mutually exclusive) — this is what
 * makes a treble/quadruple possible for a truly elite club in a great
 * season, appropriately rare since the probabilities multiply down, while
 * fixing two real bugs in the old system:
 *   1. Only one trophy could ever be recorded per season at all.
 *   2. Clubs rated 86+ could ONLY ever be labelled Champions League
 *      winners — the code never assigned "Domestic League Title" to a
 *      genuinely elite club, making winning the league structurally
 *      impossible for the best sides in the game.
 */
function getTrophyProbabilities(clubRating: number): {
  league: number; domesticCup: number; leagueCup: number; continental: number; continentalName: string;
} {
  if (clubRating >= 88) return { league: 0.35, domesticCup: 0.18, leagueCup: 0.10, continental: 0.12, continentalName: 'UEFA Champions League' };
  if (clubRating >= 82) return { league: 0.15, domesticCup: 0.18, leagueCup: 0.10, continental: 0.06, continentalName: 'UEFA Champions League' };
  if (clubRating >= 75) return { league: 0.04, domesticCup: 0.08, leagueCup: 0.06, continental: 0.04, continentalName: 'UEFA Europa League' };
  if (clubRating >= 68) return { league: 0.005, domesticCup: 0.03, leagueCup: 0.02, continental: 0.015, continentalName: 'UEFA Conference League' };
  return { league: 0.001, domesticCup: 0.01, leagueCup: 0.008, continental: 0, continentalName: '' };
}

/** Rolls every competition independently. Most seasons return an empty array — winning nothing is the normal outcome, same as real football. */
export function rollSeasonTrophies(clubRating: number): string[] {
  const p = getTrophyProbabilities(clubRating);
  const won: string[] = [];
  if (Math.random() < p.league) won.push('Domestic League Title');
  if (Math.random() < p.domesticCup) won.push('Domestic Cup');
  if (Math.random() < p.leagueCup) won.push('League Cup');
  if (p.continental > 0 && Math.random() < p.continental) won.push(p.continentalName);
  return won;
}

/**
 * Squad-fit multiplier applied to apps/goals/assists — the actual
 * "consequence" of joining a club above your level. Previously a player
 * got the same appearance count regardless of how big a reach the move
 * was; now a genuine reach means real bench/rotation risk, not a free
 * upgrade.
 */
export function computeSquadFitMultiplier(playerOvr: number, clubRating: number): number {
  const gap = clubRating - playerOvr;
  if (gap <= -3) return 1.05; // clearly the club's best player
  if (gap <= 3) return 1.0;   // good fit, first-team regular
  if (gap <= 8) return 0.75;  // rotation player, fighting for a starting spot
  if (gap <= 14) return 0.45; // fringe squad player, mostly the bench
  return 0.25;                // badly out of your depth, barely a look-in
}

/** Result of resolving a completed loan spell. */
export interface LoanResolution {
  /** True if the loan club exercised its option to keep the player permanently. */
  keptPermanently: boolean;
  /** The club the player ends up at once the loan is resolved. */
  club: string;
  clubColor: string;
  clubSecondaryColor: string;
}

/**
 * Resolves a just-completed loan season: 20% chance the loan club makes
 * the move permanent, 80% chance the player returns to the parent club
 * that sent them out. Shared by both game modes so the odds and behavior
 * are identical regardless of how the loan was played.
 */
export function resolveLoanSpell(player: Player, loanClub: Club): LoanResolution {
  const keptPermanently = Math.random() < 0.2;
  if (keptPermanently) {
    return { keptPermanently: true, club: loanClub.name, clubColor: loanClub.color, clubSecondaryColor: loanClub.secondaryColor || '#1E1E1E' };
  }
  return {
    keptPermanently: false,
    club: player.loanParentClub || player.club,
    clubColor: player.loanParentClubColor || player.clubColor,
    clubSecondaryColor: player.loanParentClubSecondaryColor || player.clubSecondaryColor,
  };
}

/** Legacy-score reward for reaching a loyalty milestone by staying put. */
export interface LoyaltyMilestone {
  legacyBonus: number;
  narrative: string | null;
}

/**
 * The Totti path: staying at one club for years builds real standing with
 * the fans even in seasons without silverware to show for it. Milestones
 * are one-off — hitting year 10 pays out once, not every season past it.
 * Shared by both modes so the payouts can't drift apart.
 */
export function checkLoyaltyMilestone(tenureYears: number): LoyaltyMilestone {
  if (tenureYears === 5) return { legacyBonus: 800, narrative: "Five years of unbroken service — the fans have started singing your name every week." };
  if (tenureYears === 10) return { legacyBonus: 2200, narrative: "A decade at the same club. You're not just a player here anymore — you're part of the furniture, a genuine one-club icon in the making." };
  if (tenureYears >= 15 && tenureYears % 5 === 0) return { legacyBonus: 3200, narrative: `${tenureYears} years and counting. Whatever happens on the pitch, your name is already etched into the club's history.` };
  return { legacyBonus: 0, narrative: null };
}

/** Result of rolling the risk of a permanent move away from a settled club. */
export interface DepartureRiskResult {
  unsettled: boolean;
  unsettledSeasons: number;
  legacyPenalty: number;
  narrative: string;
}

/**
 * The other side of the Totti path: walking away from a club you'd
 * settled at for years is a real gamble, not a free upgrade. Longer
 * tenure and a bigger reach both raise the odds of a bad landing — a
 * player who never leaves is safe but limited; a player who leaves can
 * either take off or spend years unsettled, circling smaller and smaller
 * clubs while their reputation quietly erodes. Shared by both modes.
 */
export function rollDepartureRisk(tenureYears: number, newClubRating: number, playerOvr: number): DepartureRiskResult {
  if (tenureYears < 3) {
    return { unsettled: false, unsettledSeasons: 0, legacyPenalty: 0, narrative: '' };
  }

  const legacyPenalty = Math.min(1500, tenureYears * 150);
  const baseRisk = Math.min(0.42, 0.07 * tenureYears);
  const reachRisk = (newClubRating - playerOvr) > 10 ? 0.15 : 0;
  const risk = Math.min(0.6, baseRisk + reachRisk);

  if (Math.random() >= risk) {
    return { unsettled: false, unsettledSeasons: 0, legacyPenalty, narrative: 'settled_well' };
  }

  const unsettledSeasons = 2 + Math.floor(Math.random() * 2); // 2-3 seasons
  return { unsettled: true, unsettledSeasons, legacyPenalty, narrative: 'unsettled' };
}


function simulateQuickFireSeason(player: Player, club: Club): SeasonRecord {
  const fitMultiplier = computeSquadFitMultiplier(player.ovr, club.rating);
  const baseApps = Math.round((32 + Math.floor(Math.random() * 8)) * fitMultiplier); // 32 to 40, scaled by squad fit
  const ovrBonus = (player.ovr - 65) * 0.25;

  let baseGoals = 0;
  let baseAssists = 0;

  switch (player.position) {
    case 'ST':
      baseGoals = Math.floor(Math.random() * 15) + Math.floor(ovrBonus * 1.2);
      baseAssists = Math.floor(Math.random() * 6) + Math.floor(ovrBonus * 0.4);
      break;
    case 'LW':
    case 'RW':
    case 'CAM':
      baseGoals = Math.floor(Math.random() * 10) + Math.floor(ovrBonus * 0.8);
      baseAssists = Math.floor(Math.random() * 10) + Math.floor(ovrBonus * 0.8);
      break;
    case 'CM':
    case 'LM':
    case 'RM':
      baseGoals = Math.floor(Math.random() * 6) + Math.floor(ovrBonus * 0.5);
      baseAssists = Math.floor(Math.random() * 8) + Math.floor(ovrBonus * 0.7);
      break;
    default: // CB, LB, RB, CDM, GK
      baseGoals = Math.floor(Math.random() * 3);
      baseAssists = Math.floor(Math.random() * 4) + Math.floor(ovrBonus * 0.3);
      break;
  }

  const goals = Math.round(Math.max(0, baseGoals) * fitMultiplier);
  const assists = Math.round(Math.max(0, baseAssists) * fitMultiplier);
  const rating = parseFloat((6.8 + (player.ovr / 100) * 1.5 + Math.random() * 0.6).toFixed(2));

  const trophiesWon = rollSeasonTrophies(club.rating);

  const oldOvr = player.ovr;

  return {
    year: player.year,
    age: player.age,
    club: player.club,
    leagueName: club.leagueId,
    apps: baseApps,
    goals,
    assists,
    rating,
    oldOvr,
    newOvr: oldOvr,
    ovrChange: 0,
    trophiesWon,
    awardsWon: []
  };
}

/**
 * Rolls a hidden career ceiling once per player. Not used to clip or cap
 * OVR change directly — that would reintroduce a hidden guarantee. Instead
 * it softly biases the season-performance component (see
 * computePerformanceComponent): a player operating well above what their
 * underlying ability can sustain will tend to have shakier seasons, same
 * as real football. It never overrides genuine over- or under-performance.
 */
/**
 * Rolls a player's hidden career ceiling once, at creation. Exported so
 * both game modes (and player creation itself) share the exact same
 * distribution — starting at a big club doesn't change these odds even a
 * little; roughly 4 in 5 careers cap out well short of "world class"
 * regardless of starting circumstances, same as real football.
 */
export function rollCareerCeiling(): number {
  const roll = Math.random();
  if (roll < 0.55) return 60 + Math.floor(Math.random() * 15);      // 60-74: never really breaks out (55%)
  if (roll < 0.80) return 75 + Math.floor(Math.random() * 8);       // 75-82: solid, dependable pro (25%)
  if (roll < 0.93) return 83 + Math.floor(Math.random() * 6);       // 83-88: genuinely very good (13%)
  if (roll < 0.985) return 89 + Math.floor(Math.random() * 5);      // 89-93: elite (5.5%)
  return 94 + Math.floor(Math.random() * 6);                        // 94-99: legendary (1.5%)
}

/**
 * Age-banded random component. Per design: no age band guarantees positive
 * growth — every band includes real chance of a flat or negative roll,
 * even for teenagers.
 */
/**
 * Age-banded random component, shared with Quick-Fire mode (see
 * rollAgeRandomComponent in quickfireEngine.ts) so a player of a given age
 * gets the same underlying variance whichever mode they're played in.
 */
export function rollAgeRandomComponent(age: number): number {
  if (age <= 22) return Math.floor(Math.random() * 13) - 5;   // -5 to +7
  if (age <= 25) return Math.floor(Math.random() * 11) - 5;   // -5 to +5
  if (age <= 32) return Math.floor(Math.random() * 7) - 3;    // -3 to +3
  return Math.floor(Math.random() * 11) - 7;                  // -7 to +3
}

/**
 * Season-performance component. Compares the season's actual rating
 * against what's EXPECTED for that OVR under simulateQuickFireSeason's own
 * rating formula (6.8 + ovr*0.015 + random(0,0.6)) — not an absolute
 * scale. That formula is always high in absolute terms by design (it's a
 * "how did you play" display stat, 6.8-8.9 range at any OVR), so comparing
 * against a fixed absolute threshold made a good performance component
 * almost guaranteed regardless of ability — a runaway feedback loop. This
 * compares against the player's own expected midpoint instead, so an
 * average season is genuinely neutral, not automatically a small boost.
 */
function computePerformanceComponent(seasonRating: number, ovrBeforeSeason: number, ceiling: number): number {
  const expectedRating = 6.8 + (ovrBeforeSeason / 100) * 1.5 + 0.3; // midpoint of that formula's 0-0.6 random band
  const delta = seasonRating - expectedRating;

  let base: number;
  if (delta >= 0.25) base = Math.floor(Math.random() * 2) + 3;        // +3 to +4
  else if (delta >= 0.10) base = Math.floor(Math.random() * 2) + 1;   // +1 to +2
  else if (delta >= -0.10) base = Math.floor(Math.random() * 3) - 1;  // -1 to +1
  else if (delta >= -0.25) base = -(Math.floor(Math.random() * 2) + 1); // -1 to -2
  else base = -(Math.floor(Math.random() * 3) + 2);                   // -2 to -4

  if (ceiling - ovrBeforeSeason < -3) base -= 1; // meaningfully over-performing your true level

  return base;
}

type CareerEventType = 'NONE' | 'MINOR_POSITIVE' | 'MAJOR_POSITIVE' | 'MINOR_NEGATIVE' | 'MODERATE_INJURY' | 'SEVERE_INJURY';

interface CareerEventRoll {
  type: CareerEventType;
  component: number;
  statMultiplier: number;
  description: string | null;
}

const MINOR_POSITIVE_DESCRIPTIONS = [
  "Consistent training performances caught the coaching staff's eye.",
  "A run of composed performances quietly boosted your reputation.",
  "Positive dressing-room feedback gave you a real lift this season.",
];
const MAJOR_POSITIVE_DESCRIPTIONS = [
  "A string of man-of-the-match displays turned heads across Europe.",
  "You produced the breakout form of your career at exactly the right time.",
  "Pundits and scouts alike started talking about you as the real deal this season.",
];
const MINOR_NEGATIVE_DESCRIPTIONS = [
  "A frustrating dip in form cost you your usual sharpness.",
  "Off-field distractions took a little shine off your season.",
];
const MINOR_NEGATIVE_YOUNG_DESCRIPTIONS = [
  "A loan spell didn't work out as hoped.",
  "You lost your place in the matchday squad for a stretch of the season.",
  "Coaches questioned whether you were ready for the step up just yet.",
];
const MODERATE_INJURY_DESCRIPTIONS = [
  "A troublesome hamstring strain kept you sidelined for two months.",
  "Recurring ankle ligament damage disrupted your rhythm all season.",
  "A stress fracture forced a lengthy spell out of the side.",
  "Knee inflammation required a mid-season rest period to manage.",
];
const SEVERE_INJURY_DESCRIPTIONS = [
  "A ruptured ACL required full reconstructive surgery — the road back was brutal, and you were never quite the same player again.",
  "A shattered ankle in a routine-looking challenge ended the season on the spot and cast real doubt over what came next.",
  "Persistent, unexplained back problems began chipping away at a career that had been building toward something special.",
  "A horror tackle broke your leg in two places. The recovery dragged on for over a year.",
  "Chronic knee cartilage damage was diagnosed as degenerative — manageable, but never fully fixable.",
];

/**
 * Rolls this season's "random event" component — can be positive or
 * negative, and most seasons roll NONE (nothing notable happens, which is
 * itself realistic). Severe-injury odds rise when the player is at/near
 * their career-best form — the deliberate "built something good, then it
 * was taken away" arc.
 */
function rollCareerEvent(player: Player, peakOvrSoFar: number): CareerEventRoll {
  const isNearCareerPeak = player.ovr >= peakOvrSoFar - 1 && player.ovr >= 78;
  const isYoung = player.age <= 23;

  const severeInjuryChance = isNearCareerPeak ? 0.045 : 0.018;
  const moderateInjuryChance = 0.07;
  const minorNegativeChance = 0.10;
  const minorPositiveChance = 0.12;
  const majorPositiveChance = 0.035;

  const roll = Math.random();
  let cumulative = 0;

  cumulative += severeInjuryChance;
  if (roll < cumulative) {
    return {
      type: 'SEVERE_INJURY',
      component: -(Math.floor(Math.random() * 6) + 5), // -5 to -10
      statMultiplier: 0.3 + Math.random() * 0.2,
      description: SEVERE_INJURY_DESCRIPTIONS[Math.floor(Math.random() * SEVERE_INJURY_DESCRIPTIONS.length)],
    };
  }
  cumulative += moderateInjuryChance;
  if (roll < cumulative) {
    return {
      type: 'MODERATE_INJURY',
      component: -(Math.floor(Math.random() * 3) + 2), // -2 to -4
      statMultiplier: 0.55 + Math.random() * 0.2,
      description: MODERATE_INJURY_DESCRIPTIONS[Math.floor(Math.random() * MODERATE_INJURY_DESCRIPTIONS.length)],
    };
  }
  cumulative += minorNegativeChance;
  if (roll < cumulative) {
    const pool = isYoung ? MINOR_NEGATIVE_YOUNG_DESCRIPTIONS : MINOR_NEGATIVE_DESCRIPTIONS;
    return {
      type: 'MINOR_NEGATIVE',
      component: -(Math.floor(Math.random() * 2) + 1), // -1 to -2
      statMultiplier: 0.85 + Math.random() * 0.1,
      description: pool[Math.floor(Math.random() * pool.length)],
    };
  }
  cumulative += minorPositiveChance;
  if (roll < cumulative) {
    return {
      type: 'MINOR_POSITIVE',
      component: Math.floor(Math.random() * 2) + 1, // +1 to +2
      statMultiplier: 1,
      description: MINOR_POSITIVE_DESCRIPTIONS[Math.floor(Math.random() * MINOR_POSITIVE_DESCRIPTIONS.length)],
    };
  }
  cumulative += majorPositiveChance;
  if (roll < cumulative) {
    return {
      type: 'MAJOR_POSITIVE',
      component: Math.floor(Math.random() * 3) + 3, // +3 to +5
      statMultiplier: 1,
      description: MAJOR_POSITIVE_DESCRIPTIONS[Math.floor(Math.random() * MAJOR_POSITIVE_DESCRIPTIONS.length)],
    };
  }
  return { type: 'NONE', component: 0, statMultiplier: 1, description: null };
}


export function calculateCareerRating(player: Player, peakOvr: number): 'C' | 'B' | 'A' | 'S' | 'LEGENDARY' {
  const totalContrib = player.totalGoals + player.totalAssists;
  const trophies = player.totalTrophies;
  const ballonDors = player.ballonDorsWon;

  if (ballonDors >= 2 || (peakOvr >= 90 && trophies >= 8 && totalContrib >= 300)) {
    return 'LEGENDARY';
  }
  if (ballonDors >= 1 || (peakOvr >= 86 && trophies >= 5) || totalContrib >= 250) {
    return 'S';
  }
  if (peakOvr >= 80 || trophies >= 3 || totalContrib >= 150) {
    return 'A';
  }
  if (peakOvr >= 74 || totalContrib >= 80) {
    return 'B';
  }
  return 'C';
}

/**
 * Runs the entire Quick Fire career simulation in a single function call!
 */
export function runFullQuickFireCareer(
  initialPlayer: Player,
  initialSuperstars: Superstar[] = INITIAL_SUPERSTARS,
  initialClubs: Club[] = [],
  initialLeagues: League[] = LEAGUES_2026
): {
  finalPlayer: Player;
  summary: QuickFireSummaryData;
  timeline: TimelineEntry[];
  superstars: Superstar[];
  newsFeed: WorldHeadlinePackage[];
} {
  let player = JSON.parse(JSON.stringify(initialPlayer)) as Player;
  if (!player.hiddenTraits || player.hiddenTraits.length === 0) {
    player.hiddenTraits = generateHiddenTraits();
  }
  if (!player.careerCeiling) {
    player.careerCeiling = rollCareerCeiling();
  }
  player.gameMode = 'QUICK_FIRE';

  let superstars = JSON.parse(JSON.stringify(initialSuperstars)) as Superstar[];
  let clubs = initialClubs.length > 0 ? JSON.parse(JSON.stringify(initialClubs)) : [];
  let timeline: TimelineEntry[] = [];
  let newsFeed: WorldHeadlinePackage[] = [];

  const startYear = player.year;
  let peakOvr = player.ovr;
  // Accumulates legacy-score effects from loyalty milestones and
  // departure-risk penalties — added into the final legacyScore below,
  // since Quick-Fire computes that from aggregate totals rather than
  // per-season bonuses the way manual mode does.
  let bonusLegacyScore = 0;

  const clubTenures: Record<string, { years: number; goals: number; apps: number; trophies: number }> = {};
  let consecutivePoorFitSeasons = 0;

  while (true) {
    // 1. Check Forced Retirement
    // Forced retirement is 46 years old. If a player is 33+ years old and below 66 rated then they are also forced to retire.
    if (player.age >= 46 || (player.age >= 33 && player.ovr < 66)) {
      break;
    }

    const currentClubObj = getClubByName(player.club);

    // 2. Simulate Season
    const seasonRecord = simulateQuickFireSeason(player, currentClubObj);

    // Wonderkid crossroads — checked with priority, same as manual mode.
    // Quick-Fire has no player to ask, so the AI auto-decides: a player
    // still meaningfully below their hidden ceiling fights for it more
    // often; one who's already close to done developing is more likely
    // to cut losses and leave for regular football.
    const crossroads = checkWonderkidCrossroads(player, currentClubObj.rating);
    let crossroadsFired = false;
    if (crossroads && crossroads.choices) {
      crossroadsFired = true;
      const roomToGrow = (player.careerCeiling ?? 80) - player.ovr;
      const fightChance = roomToGrow >= 8 ? 0.6 : 0.3;
      const choiceIndex = Math.random() < fightChance ? 0 : 1;
      const result = crossroads.choices[choiceIndex].resolve(player);
      player.ovr = Math.max(48, Math.min(99, player.ovr + result.ovrDelta));
      bonusLegacyScore += result.legacyBonus;
      timeline.unshift({
        id: `qf_crossroads_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
        year: player.year,
        age: player.age,
        generation: player.generation || 1,
        playerName: player.name,
        club: player.club,
        type: 'MILESTONE',
        icon: '🔀',
        color: choiceIndex === 0 ? '#E67E22' : '#3498DB',
        title: choiceIndex === 0 ? 'Crossroads — Chose To Fight For It' : 'Crossroads — Chose To Leave',
        description: result.text
      });
    }

    // 3. OVR Progression: ratingChange = random(age-band) + performance + event.
    // No component here has a guaranteed floor — every age band, every
    // performance tier, and every event type can be zero or negative.
    const randomComponent = rollAgeRandomComponent(player.age);
    const performanceComponent = computePerformanceComponent(seasonRecord.rating, player.ovr, player.careerCeiling ?? 80);
    const eventRoll = rollCareerEvent(player, peakOvr);

    let ovrDelta = randomComponent + performanceComponent + eventRoll.component;

    // Unsettled penalty — a departure risk roll gone badly (see
    // rollDepartureRisk) further dampens growth while it's active.
    if ((player.unsettledSeasonsRemaining ?? 0) > 0) {
      ovrDelta -= 2;
    }

    // Hidden ceiling taper — multiplicative, not additive, so it can't be
    // out-muscled by a lucky stack of age roll + performance + event all
    // landing positive the same season. Decline is never dampened.
    if (ovrDelta > 0) {
      const ceiling = player.careerCeiling ?? 80;
      const distanceToCeiling = ceiling - player.ovr;
      let growthMultiplier = 1;
      if (distanceToCeiling <= -8) growthMultiplier = 0;
      else if (distanceToCeiling <= -4) growthMultiplier = 0.1;
      else if (distanceToCeiling <= -1) growthMultiplier = 0.15;
      else if (distanceToCeiling <= 2) growthMultiplier = 0.3;
      else if (distanceToCeiling <= 5) growthMultiplier = 0.55;
      ovrDelta *= growthMultiplier;
    }

    const oldOvr = player.ovr;
    player.ovr = Math.max(50, Math.min(99, player.ovr + ovrDelta));
    seasonRecord.oldOvr = oldOvr;
    seasonRecord.newOvr = player.ovr;
    seasonRecord.ovrChange = ovrDelta;

    if (eventRoll.type === 'MODERATE_INJURY' || eventRoll.type === 'SEVERE_INJURY') {
      seasonRecord.injurySeverity = eventRoll.type === 'SEVERE_INJURY' ? 'SEVERE' : 'MODERATE';
      seasonRecord.injuryDescription = eventRoll.description ?? undefined;
    }
    if (eventRoll.statMultiplier !== 1) {
      seasonRecord.apps = Math.round(seasonRecord.apps * eventRoll.statMultiplier);
      seasonRecord.goals = Math.round(seasonRecord.goals * eventRoll.statMultiplier);
      seasonRecord.assists = Math.round(seasonRecord.assists * eventRoll.statMultiplier);
    }

    if (player.ovr > peakOvr) peakOvr = player.ovr;

    // Update Totals
    player.history.push(seasonRecord);
    player.totalApps += seasonRecord.apps;
    player.totalGoals += seasonRecord.goals;
    player.totalAssists += seasonRecord.assists;
    player.avgRatingSum += seasonRecord.rating;
    player.totalTrophies += seasonRecord.trophiesWon.length;

    // Track Club Tenures — use currentClubObj.name, not player.club: if
    // the crossroads fired this season it may have already changed
    // player.club for NEXT season, but these stats belong to the club the
    // season was actually played at.
    if (!clubTenures[currentClubObj.name]) {
      clubTenures[currentClubObj.name] = { years: 0, goals: 0, apps: 0, trophies: 0 };
    }
    clubTenures[currentClubObj.name].years += 1;
    clubTenures[currentClubObj.name].goals += seasonRecord.goals;
    clubTenures[currentClubObj.name].apps += seasonRecord.apps;
    clubTenures[currentClubObj.name].trophies += seasonRecord.trophiesWon.length;

    // 4. International Duty
    const intResult = simulateInternationalDuty(player);
    if (intResult.calledUp) {
      player.intCaps += intResult.caps;
      player.intGoals += intResult.goals;
      if (intResult.trophyWon) {
        player.intTrophies.push(intResult.trophyWon);
        player.totalTrophies += 1;
      }
    }

    // 5. Awards (Ballon d'Or & Golden Shoe)
    const ballonDor = calculateBallonDor(player, {
      goals: seasonRecord.goals,
      assists: seasonRecord.assists,
      avgRating: seasonRecord.rating,
      trophyWon: seasonRecord.trophiesWon.length > 0,
      intTrophyWon: intResult.trophyWon !== null,
      apps: seasonRecord.apps
    }, superstars);
    if (ballonDor.isUserWinner) {
      player.ballonDorsWon += 1;
      player.ballonDorStreak = (player.ballonDorStreak ?? 0) + 1;
      seasonRecord.awardsWon.push("Ballon d'Or Winner");
    } else {
      player.ballonDorStreak = 0;
    }

    const goldenShoe = calculateGoldenShoe(player, seasonRecord.goals);
    if (goldenShoe) {
      player.goldenShoesWon += 1;
      seasonRecord.awardsWon.push("Golden Shoe Winner");
    }

    // 6. Timeline Entry
    const wonTrophyThisSeason = seasonRecord.trophiesWon.length > 0;
    const timelineEntry: TimelineEntry = {
      id: `qf_tl_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
      year: player.year,
      age: player.age,
      generation: player.generation || 1,
      playerName: player.name,
      club: player.club,
      type: wonTrophyThisSeason ? 'TROPHY' : 'MILESTONE',
      icon: wonTrophyThisSeason ? '🏆' : '🎯',
      color: wonTrophyThisSeason ? '#F1C40F' : '#2ECC71',
      title: wonTrophyThisSeason
        ? (seasonRecord.trophiesWon.length > 1 ? `${player.year}: ${seasonRecord.trophiesWon.length}-Trophy Season!` : `${player.year} Season Concluded`)
        : `${player.year} Season Concluded`,
      description: wonTrophyThisSeason
        ? `Won ${seasonRecord.trophiesWon.join(', ')} with ${player.club}. Recorded ${seasonRecord.goals} goals and ${seasonRecord.assists} assists (${seasonRecord.rating} Avg Rating).`
        : `Played for ${player.club}. Recorded ${seasonRecord.goals} goals and ${seasonRecord.assists} assists (${seasonRecord.rating} Avg Rating).`
    };
    timeline.unshift(timelineEntry);

    if (eventRoll.type === 'MODERATE_INJURY' || eventRoll.type === 'SEVERE_INJURY') {
      const wasNearPeak = oldOvr >= peakOvr - 1 && oldOvr >= 78;
      const isSevere = eventRoll.type === 'SEVERE_INJURY';
      timeline.unshift({
        id: `qf_inj_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
        year: player.year,
        age: player.age,
        generation: player.generation || 1,
        playerName: player.name,
        club: player.club,
        type: 'INJURY',
        icon: isSevere ? '🩼' : '🤕',
        color: isSevere ? '#8B0000' : '#C0392B',
        title: isSevere
          ? (wasNearPeak ? 'Career-Altering Injury — At the Peak of Your Powers' : 'Career-Altering Injury')
          : 'Significant Injury Setback',
        description: eventRoll.description ?? ''
      });
    } else if (eventRoll.type === 'MAJOR_POSITIVE') {
      timeline.unshift({
        id: `qf_pos_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
        year: player.year,
        age: player.age,
        generation: player.generation || 1,
        playerName: player.name,
        club: player.club,
        type: 'MILESTONE',
        icon: '⭐',
        color: '#F1C40F',
        title: 'Breakout Season',
        description: eventRoll.description ?? ''
      });
    }

    // 7. World Evolution
    const adv = advanceSuperstars(superstars, player.year);
    superstars = adv.updatedSuperstars;
    if (adv.retirementHeadlines.length > 0) {
      newsFeed.unshift({ year: player.year, headlines: adv.retirementHeadlines });
    }
    if (clubs.length > 0) {
      const { updatedClubs, headlines } = evolveWorldClubsAndOwners(clubs, player.year);
      clubs = updatedClubs;
    }

    // 8. Transfers for Next Season — skipped entirely the season the
    // crossroads fires, since that decision already settled where the
    // player is for next season. Running the normal AI transfer logic
    // right after would risk immediately moving them again off a stale
    // club reference.
    if (!crossroadsFired) {
    const fitGap = currentClubObj.rating - player.ovr;
    if (fitGap > 8) {
      consecutivePoorFitSeasons += 1;
    } else {
      consecutivePoorFitSeasons = 0;
    }
    const forcedListing = consecutivePoorFitSeasons >= 2;
    if (forcedListing) player.isTransferListed = true;

    // Resolve a just-completed loan spell before offers are generated for
    // next season, so a "STAY" offer (if any) refers to the right club —
    // either the loan club (if kept permanently) or the parent club the
    // player is returning to.
    if (player.loanParentClub) {
      const resolution = resolveLoanSpell(player, currentClubObj);
      const wasLoanClub = player.club;
      player.club = resolution.club;
      player.clubColor = resolution.clubColor;
      player.clubSecondaryColor = resolution.clubSecondaryColor;
      // Made permanent = a new home, tenure starts over there. Returned
      // to the parent club = tenure was only ever paused, not reset.
      if (resolution.keptPermanently) player.currentClubTenure = 0;
      player.loanParentClub = undefined;
      player.loanParentClubColor = undefined;
      player.loanParentClubSecondaryColor = undefined;

      timeline.unshift({
        id: `qf_loan_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
        year: player.year,
        age: player.age,
        generation: player.generation || 1,
        playerName: player.name,
        club: resolution.club,
        type: 'TRANSFER',
        icon: resolution.keptPermanently ? '✅' : '↩️',
        color: resolution.keptPermanently ? '#2ECC71' : '#3498DB',
        title: resolution.keptPermanently ? `Loan Made Permanent — Signed for ${wasLoanClub}` : `Loan Spell Ended — Returned to ${resolution.club}`,
        description: resolution.keptPermanently
          ? `Impressed enough on loan that ${wasLoanClub} triggered the option to make the move permanent.`
          : `The season-long loan at ${wasLoanClub} concluded, and the move back to ${resolution.club} followed as agreed.`
      });
    }

    const offers = generateClubOffers(player);
    const chosenOffer = aiSelectTransferOffer(player, offers);

    if (chosenOffer.type === 'STAY') {
      player.currentClubTenure = (player.currentClubTenure ?? 0) + 1;
      const milestone = checkLoyaltyMilestone(player.currentClubTenure);
      if (milestone.legacyBonus > 0) {
        bonusLegacyScore += milestone.legacyBonus;
        timeline.unshift({
          id: `qf_loyal_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
          year: player.year,
          age: player.age,
          generation: player.generation || 1,
          playerName: player.name,
          club: player.club,
          type: 'MILESTONE',
          icon: '❤️',
          color: '#F1C40F',
          title: `${player.currentClubTenure} Years At ${player.club}`,
          description: milestone.narrative || ''
        });
      }
    }

    if (chosenOffer.type !== 'STAY' && chosenOffer.club.name !== player.club) {
      if (chosenOffer.type === 'LOAN') {
        player.loanParentClub = player.club;
        player.loanParentClubColor = player.clubColor;
        player.loanParentClubSecondaryColor = player.clubSecondaryColor;
      } else {
        // A real, permanent departure — same risk/reward gamble manual
        // mode faces. Longer settled tenure means a harder fall if it
        // goes wrong, and real fan backlash either way.
        const priorTenure = player.currentClubTenure ?? 0;
        const risk = rollDepartureRisk(priorTenure, chosenOffer.club.rating, player.ovr);
        if (priorTenure >= 3) bonusLegacyScore -= risk.legacyPenalty;
        if (risk.unsettled) player.unsettledSeasonsRemaining = risk.unsettledSeasons;
        player.currentClubTenure = 0;
      }
      player.club = chosenOffer.club.name;
      player.clubColor = chosenOffer.club.color;
      player.clubSecondaryColor = chosenOffer.club.secondaryColor || '#FFFFFF';
      player.isTransferListed = false;
      consecutivePoorFitSeasons = 0;

      timeline.unshift({
        id: `qf_tr_${player.year}_${Math.random().toString(36).substr(2, 4)}`,
        year: player.year,
        age: player.age,
        generation: player.generation || 1,
        playerName: player.name,
        club: chosenOffer.club.name,
        type: 'TRANSFER',
        icon: '🔄',
        color: '#3498DB',
        title: forcedListing ? `Forced Out — Transferred to ${chosenOffer.club.name}` : (chosenOffer.type === 'LOAN' ? `Loan Move to ${chosenOffer.club.name}` : `Transferred to ${chosenOffer.club.name}`),
        description: forcedListing
          ? `Squeezed out of the squad and pushed toward the exit, the move to ${chosenOffer.club.name} followed. ${chosenOffer.description}`
          : chosenOffer.description
      });
    } else if (forcedListing) {
      // Stayed despite being squeezed out — reset pressure so it doesn't
      // compound indefinitely if no suitable offer materialized.
      player.isTransferListed = false;
    }
    } // end if (!crossroadsFired)

    // Wind down an active "unsettled" spell one season at a time.
    if ((player.unsettledSeasonsRemaining ?? 0) > 0) {
      player.unsettledSeasonsRemaining = (player.unsettledSeasonsRemaining ?? 0) - 1;
    }

    player.year += 1;
    player.age += 1;
  }

  // Finalize Summary
  const clubsPlayedList = Object.entries(clubTenures).map(([clubName, data]) => ({
    clubName,
    years: data.years,
    goals: data.goals,
    apps: data.apps,
    trophies: data.trophies
  }));

  const endYear = player.year - 1;
  const careerLength = endYear - startYear + 1;
  const totalSeasons = player.history.length;

  let legacyScore = Math.max(0, (player.totalGoals * 5) + (player.totalAssists * 3) + (player.totalTrophies * 50) + (player.ballonDorsWon * 200) + (player.intCaps * 2) + (peakOvr * 10) + bonusLegacyScore);
  const careerRating = calculateCareerRating(player, peakOvr);

  const recordsBroken: string[] = [];
  if (player.totalGoals >= 200) recordsBroken.push("200+ Career Club Goals");
  if (player.ballonDorsWon > 0) recordsBroken.push(`${player.ballonDorsWon}x Ballon d'Or Winner`);
  if (player.intCaps >= 50) recordsBroken.push(`${player.intCaps} International Caps`);
  if (player.totalTrophies >= 10) recordsBroken.push("Double-Digit Trophy Winner");

  const hallOfFameStatus = careerRating === 'LEGENDARY' ? 'First Ballot Legend' : careerRating === 'S' ? 'All-Time Great' : careerRating === 'A' ? 'Club Icon' : 'Professional Veteran';

  const summary: QuickFireSummaryData = {
    careerLength,
    startYear,
    endYear,
    peakOvr,
    clubsPlayed: clubsPlayedList,
    totalSeasons,
    totalApps: player.totalApps,
    totalGoals: player.totalGoals,
    totalAssists: player.totalAssists,
    totalTrophies: player.totalTrophies,
    ballonDorsWon: player.ballonDorsWon,
    goldenShoesWon: player.goldenShoesWon,
    intCaps: player.intCaps,
    intGoals: player.intGoals,
    intTrophies: player.intTrophies,
    legacyScore,
    hallOfFameStatus,
    recordsBroken,
    careerRating
  };

  return {
    finalPlayer: player,
    summary,
    timeline,
    superstars,
    newsFeed
  };
}
