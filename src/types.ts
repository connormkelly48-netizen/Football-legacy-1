export type Position = 
  | 'ST' | 'CAM' | 'CM' | 'CB' | 'LB' | 'RB' 
  | 'CDM' | 'LM' | 'RM' | 'LW' | 'RW' | 'GK';

export type StoryPreset = 'wonderkid' | 'standard' | 'late' | 'custom';

export interface PlayerTrait {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface SeasonRecord {
  year: number;
  age: number;
  club: string;
  leagueName: string;
  apps: number;
  goals: number;
  assists: number;
  rating: number;
  oldOvr: number;
  newOvr: number;
  ovrChange: number;
  /** Every trophy won this season — a genuinely elite club in a great season can win more than one. */
  trophiesWon: string[];
  awardsWon: string[];
  /** Present only on seasons with a moderate or severe injury. */
  injurySeverity?: 'MINOR' | 'MODERATE' | 'SEVERE';
  injuryDescription?: string;
}

export type ClubPhilosophy = 
  | 'YOUTH_DEVELOPMENT' 
  | 'MONEYBALL' 
  | 'LOCAL_TALENT' 
  | 'WORLD_SUPERSTARS' 
  | 'WINNING_NOW' 
  | 'FINANCIAL_STABILITY' 
  | 'LONG_TERM_DEVELOPMENT' 
  | 'SELLING_CLUB' 
  | 'BUYING_CLUB' 
  | 'DEFENSIVE_FOOTBALL' 
  | 'ATTACKING_FOOTBALL' 
  | 'BALANCED'
  | 'PROVEN_STARS'
  | 'YOUTH_ACADEMY'
  | 'BALANCED_MIX'
  | 'VETERAN_EXPERIENCE'
  // Added for the full 2026/27 European database (Prompt 2):
  | 'ELITE_RECRUITMENT'
  | 'POSSESSION_FOOTBALL'
  | 'COUNTER_ATTACKING'
  | 'DEFENSIVE_STRUCTURE'
  | 'LOCAL_TALENT_DEVELOPMENT';

export type HiddenTrait = 
  | 'LOYAL'
  | 'AMBITIOUS'
  | 'MONEY_MOTIVATED'
  | 'HOMEBODY'
  | 'JOURNEYMAN'
  | 'BIG_MATCH_PLAYER'
  | 'RISK_TAKER'
  | 'ACADEMY_HERO'
  | 'LEGEND_BUILDER'
  | 'TROPHY_HUNTER'
  | 'UNDERDOG'
  | 'LATE_EXPLORER'
  | 'LEADER'
  | 'MERCENARY'
  | 'FAN_FAVOURITE'
  | 'NATIONAL_HERO'
  | 'FAMILY_FOCUSED'
  | 'SETTLED'
  | 'ADVENTURER';

export type GameMode = 'CAREER' | 'QUICK_FIRE' | 'LEGEND';

export type OwnerPersonality = 
  | 'YOUTH_INVESTOR'
  | 'GALACTICO_OWNER'
  | 'BUSINESS_OWNER'
  | 'LOCAL_INVESTOR'
  | 'AGGRESSIVE_OWNER'
  | 'PATIENT_OWNER'
  | 'FINANCIALLY_CONSERVATIVE';

export interface Owner {
  id: string;
  name: string;
  personality: OwnerPersonality;
  patience: number;
  spendingPower: number;
  age: number;
}

export interface MultiClubGroup {
  id: string;
  name: string;
  clubIds: string[];
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  nationality: string;
  position: Position;
  age: number;
  ovr: number;
  mediaPot: number;
  club: string;
  clubColor: string;
  clubSecondaryColor: string;
  year: number;
  generation: number;
  traits: PlayerTrait[];
  history: SeasonRecord[];
  
  // Total Club/Career Stats
  totalApps: number;
  totalGoals: number;
  totalAssists: number;
  totalTrophies: number;
  avgRatingSum: number;
  
  // International Stats
  intCaps: number;
  intGoals: number;
  intAssists: number;
  intTrophies: string[];
  isCaptain: boolean;

  // Personal Records / Milestones
  motmAwards: number;
  goldenShoesWon: number;
  ballonDorsWon: number;

  // Transfer Status & Hidden Engine
  isTransferListed?: boolean;
  hiddenTraits?: HiddenTrait[];
  gameMode?: GameMode;
  isLegendMode?: boolean;
  realBaseline?: any;
  supporterBadge?: string;
  /**
   * Hidden potential ceiling, rolled once early in a career and never
   * revealed directly to the player. Growth tapers hard as OVR approaches
   * this number — this is what makes most careers plateau in the 60s-70s
   * rather than every player drifting toward world-class given enough
   * seasons. See rollCareerCeiling() in quickfireEngine.ts.
   */
  careerCeiling?: number;

  /**
   * Set only while the player is out on loan. Holds the club (and colors)
   * they'll return to once the loan season ends, unless the loan club
   * rolls to make the move permanent. Cleared as soon as the loan is
   * resolved, whichever way it goes.
   */
  loanParentClub?: string;
  loanParentClubColor?: string;
  loanParentClubSecondaryColor?: string;

  /**
   * Consecutive-season Ballon d'Or win count, reset to 0 the moment a
   * season passes without winning. Used to apply a "voter fatigue"
   * penalty in calculateBallonDor() — winning it 8-9 times in a row is
   * not something even real all-time greats do, so repeat wins get
   * progressively harder to keep the award meaningful.
   */
  ballonDorStreak?: number;

  /**
   * Consecutive seasons spent at the CURRENT club (STAY streak). Resets
   * to 0 on any permanent transfer (loans don't reset it — you're still
   * contracted to the parent club). Drives the loyalty/legend system:
   * long, unbroken tenure builds real standing with the fans even if
   * trophies stay scarce, the Totti path.
   */
  currentClubTenure?: number;

  /**
   * Set when a permanent transfer away from a long-settled club rolls
   * badly (see rollDepartureRisk in quickfireEngine.ts). While this is
   * above 0, growth is further dampened and the offers you receive skew
   * toward smaller, safer clubs — the "circling smaller clubs, regretting
   * the decision" spiral. Decrements by 1 each season until it clears.
   */
  unsettledSeasonsRemaining?: number;

  /**
   * True once the young-prospect-stuck-behind-the-first-team crossroads
   * event has fired for this player, so it only ever asks once per
   * career — "fight for your place, or leave for regular football."
   */
  crossroadsResolved?: boolean;
}

export interface QuickFireSummaryData {
  careerLength: number;
  startYear: number;
  endYear: number;
  peakOvr: number;
  clubsPlayed: { clubName: string; years: number; goals: number; apps: number; trophies: number }[];
  totalSeasons: number;
  totalApps: number;
  totalGoals: number;
  totalAssists: number;
  totalTrophies: number;
  ballonDorsWon: number;
  goldenShoesWon: number;
  intCaps: number;
  intGoals: number;
  intTrophies: string[];
  legacyScore: number;
  hallOfFameStatus: string;
  recordsBroken: string[];
  careerRating: 'C' | 'B' | 'A' | 'S' | 'LEGENDARY';
}

export interface Ancestor {
  generation: number;
  name: string;
  nationality: string;
  position: Position;
  startYear: number;
  retireYear: number;
  peakOvr: number;
  finalClub: string;
  totalApps: number;
  totalGoals: number;
  totalAssists: number;
  totalTrophies: number;
  ballonDorsWon: number;
  intCaps: number;
  intGoals: number;
  inheritedTraits: PlayerTrait[];
  hallOfFame: boolean;
}

export interface League {
  id: string;
  name: string;
  country: string;
  tier: number;
  rep: number;
  promotionTo: string | null;
  relegationTo: string | null;
}

export interface Club {
  id: string;
  name: string;
  leagueId: string;
  rating: number;
  color: string;
  secondaryColor?: string;
  philosophy?: ClubPhilosophy;
  stadium?: string;
  finances?: number;
  owner?: Owner;
  rivals?: string[];
  multiClubGroupId?: string;
  historicalPeak?: number;
  historicalTrough?: number;
}

export interface TransferOffer {
  id: string;
  club: Club;
  type: 'STAY' | 'TOO_GOOD' | 'PERFECT' | 'LOWER_TIER' | 'LOAN' | 'FORCED_TRANSFER' | 'SISTER_CLUB';
  label: string;
  tagClass: string;
  contractLength: number;
  description: string;
}

export interface ChoiceOption {
  label: string;
  description: string;
  resolve: (player: Player) => { ovrDelta: number; legacyBonus: number; text: string; forceHigherOffers?: boolean };
}

export interface RandomEvent {
  id: string;
  title: string;
  category: 'DEVELOPMENT' | 'INJURY' | 'CLUB' | 'WORLD' | 'CAREER';
  isInteractive: boolean;
  rarity: 'very_common' | 'common' | 'uncommon' | 'rare' | 'legendary';
  condition: (player: Player) => boolean;
  description?: string;
  choices?: ChoiceOption[];
  execute?: (player: Player) => { ovrDelta: number; legacyBonus: number; text: string; forceHigherOffers?: boolean };
}

export interface TimelineEntry {
  id: string;
  year: number;
  age: number;
  generation: number;
  playerName: string;
  club: string;
  type: 'TRANSFER' | 'MILESTONE' | 'AWARD' | 'TROPHY' | 'INJURY' | 'GENERATION' | 'INTERNATIONAL';
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface WorldHeadlinePackage {
  year: number;
  headlines: string[];
}

export interface Superstar {
  id: string;
  name: string;
  club: string;
  ovr: number;
  pos: Position;
  age: number;
  peakOvr: number;
  nationality?: string;
  isRetired?: boolean;
  /**
   * 0-1, how likely this player is to stay put rather than transfer.
   * Hand-tuned for named players to reflect real tendencies (a homegrown
   * one-club type vs. someone already known for chasing a move) — this is
   * what makes Mbappé-style players plausible to leave while a
   * Musiala-style player might stay for their whole career. Regens get a
   * randomized value so no future superstar's career shape is predictable.
   */
  loyalty?: number;
  /** Seasons at current club — resets on transfer, drives rising wanderlust over a long stay. */
  yearsAtClub?: number;
  /** Consecutive seasons at 86+ OVR — drives regression-to-mean pressure so a decade of sustained elite form stays genuinely rare, not the norm. */
  eliteStreak?: number;
  retiredYear?: number;
  isRegen?: boolean;
}

export interface SaveSlot {
  id: number;
  saveName: string;
  dateSaved: string;
  player: Player | null;
  legacyTree: Ancestor[];
  legacyScore: number;
  currentGeneration: number;
  timeline: TimelineEntry[];
  newsFeed: WorldHeadlinePackage[];
  dynamicLeagues: League[];
  worldSuperstars?: Superstar[];
  /**
   * Evolved club state (ratings, ownership, finances) at time of save.
   * Without this, club evolution from evolveWorldClubsAndOwners was
   * silently lost on reload — every session restarted from the database's
   * static baseline. Optional for backward compatibility with saves from
   * before this field existed; loader falls back to the baseline database.
   */
  dynamicClubs?: Club[];
  /** Which football database this save was created against, e.g. "2026_27". */
  databaseId?: string;
  /** Database manifest version at time of save (see DatabaseManifest.version). */
  databaseVersion?: string;
  /** DLC database IDs active when this save was created, beyond the base database. */
  installedDLC?: string[];
  /** App/game version this save was created with, for future migration logic. */
  gameVersion?: string;
}
