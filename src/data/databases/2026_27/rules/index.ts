import { LeagueRecord } from '../../../types/database';

/** Returns the league a club promotes into from `league`, or null if it's the top tier. */
export function getPromotionTarget(league: LeagueRecord, allLeagues: LeagueRecord[]): LeagueRecord | null {
  if (!league.promotionTo) return null;
  return allLeagues.find(l => l.id === league.promotionTo) ?? null;
}

/** Returns the league a club relegates into from `league`, or null if it's the bottom tier. */
export function getRelegationTarget(league: LeagueRecord, allLeagues: LeagueRecord[]): LeagueRecord | null {
  if (!league.relegationTo) return null;
  return allLeagues.find(l => l.id === league.relegationTo) ?? null;
}
