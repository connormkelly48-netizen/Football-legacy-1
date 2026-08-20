/**
 * FOOTBALL UNIVERSE — DATABASE ARCHITECTURE TYPES
 * ------------------------------------------------
 * These are the normalized, source-of-truth types used to AUTHOR a football
 * database (e.g. the 2026_27 season, or a future 1999_00 historical database).
 *
 * They are intentionally separate from the "runtime" gameplay types in
 * `src/types.ts` (Club, League, Owner, MultiClubGroup). Those runtime types
 * are what the game engine and UI actually consume, and they are produced by
 * MATERIALIZING a FootballDatabase via `src/data/databaseLoader.ts`.
 *
 * Why keep them separate?
 * - The engine should never know which database is loaded, or care about its
 *   internal shape — it only ever sees the flat, denormalized runtime shape.
 * - Authored data references other records by permanent ID (countryId,
 *   leagueId, ownerEntityId) instead of duplicating data inline.
 * - Overall club strength is CALCULATED from attributes, never hand-typed.
 */

import { OwnerPersonality, ClubPhilosophy } from '../../types';

export interface Country {
  /** Permanent 3-letter ID, e.g. "ENG". Never changes once assigned. */
  id: string;
  name: string;
}

export interface LeagueRecord {
  /** Permanent ID, e.g. "ENG_PREM". Never changes once assigned. */
  id: string;
  name: string;
  countryId: string;
  tier: number;
  rep: number;
  /** League.id promoted teams move into, or null if this is the top tier. */
  promotionTo: string | null;
  /** League.id relegated teams move into, or null if this is the bottom tier. */
  relegationTo: string | null;
}

/**
 * The raw attributes that DRIVE a club's calculated overall rating.
 * Nothing here is "the rating" — see `computeClubOverall` in
 * `src/data/utilities/rating.ts`.
 */
export interface ClubAttributes {
  /** 0-99. Historical prestige & pedigree. Moves slowly. */
  reputation: number;
  /** 0-99. Transfer/wage budget power. */
  finances: number;
  /** 0-99. Academy & youth pipeline quality. */
  youth: number;
  /** 0-99. Training ground / infrastructure quality. */
  facilities: number;
  /** 0-99. Support size & matchday atmosphere. */
  fanbase: number;
  /** 0-99. Stadium quality/atmosphere rating (distinct from raw capacity). */
  stadiumRating: number;
}

export type OwnerEntityType = 'INDIVIDUAL' | 'MULTI_CLUB_GROUP' | 'CONSORTIUM' | 'MEMBER_OWNED';

/**
 * A single owner OR a multi-club ownership network (e.g. City Football
 * Group, INEOS, Red Bull, BlueCo). Referenced by clubs via ID rather than
 * embedded, so a group's data only ever lives in one place.
 */
export interface OwnerEntity {
  id: string;
  type: OwnerEntityType;
  name: string;
  /** Only meaningful for INDIVIDUAL / CONSORTIUM owners. */
  personality?: OwnerPersonality;
  patience?: number;
  spendingPower?: number;
  age?: number;
  /** Club.id[] under this ownership entity. */
  clubIds: string[];
}

export interface ClubRecord {
  /** Permanent short ID, e.g. "MUN", "LIV", "MCI". Never changes. */
  id: string;
  name: string;
  /** Short display name, e.g. "Man Utd". */
  shortName: string;
  /** Year founded. */
  founded: number;
  city: string;
  leagueId: string;
  countryId: string;
  colors: { primary: string; secondary?: string };
  stadium: string;
  stadiumCapacity: number;
  /** Drives the calculated overall — never store overall directly here. */
  attributes: ClubAttributes;
  philosophy?: ClubPhilosophy;
  /** 0-99: drives AI transfer aggressiveness and title/survival expectations. */
  ambition: number;
  /** References an INDIVIDUAL/CONSORTIUM/MEMBER_OWNED OwnerEntity.id, if any. */
  ownerEntityId?: string;
  /** References a MULTI_CLUB_GROUP OwnerEntity.id, if any (independent of ownerEntityId). */
  groupId?: string;
  /** Club.id[] of rivals. May reference clubs not yet present in this database. */
  rivals?: string[];
  historicalPeak?: number;
  historicalTrough?: number;
}

export type CompetitionType = 'DOMESTIC_LEAGUE' | 'DOMESTIC_CUP' | 'CONTINENTAL' | 'INTERNATIONAL';

/**
 * Competitions are deliberately decoupled from hard-coded club lists.
 * Participants are determined at simulation time by `qualificationRule`
 * (today a human-readable description; a future DLC can formalize this into
 * a real rules engine without touching this shape).
 */
export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
  countryId?: string;
  /** For DOMESTIC_LEAGUE competitions: the League this crowns a champion for. */
  leagueId?: string;
  qualificationRule?: string;
  promotionRule?: string;
  relegationRule?: string;
  hasPlayoffs?: boolean;
}

export interface DatabaseManifest {
  /** Permanent database ID, e.g. "2026_27". */
  id: string;
  displayName: string;
  version: string;
  /** Country.id[] included in this database. */
  includedRegions: string[];
  minSupportedGameVersion: string;
}

export interface FootballDatabase {
  manifest: DatabaseManifest;
  countries: Country[];
  leagues: LeagueRecord[];
  clubs: ClubRecord[];
  ownerEntities: OwnerEntity[];
  competitions: Competition[];
}

export interface ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
