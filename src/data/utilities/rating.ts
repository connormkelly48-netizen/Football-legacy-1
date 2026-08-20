import { ClubAttributes } from '../types/database';

/**
 * Weights used to calculate a club's initial overall rating from its
 * authored attributes. These are intentionally simple and documented here
 * in one place so future tuning is a one-line change, not a data rewrite.
 *
 * NOTE: This produces the club's STARTING overall when a database is
 * loaded. Once a career is underway, `evolveWorldClubsAndOwners` (in
 * `src/data/database2026.ts`) evolves the *runtime* rating season-to-season
 * as a normal gameplay mechanic — that evolution is unrelated to this
 * formula and is preserved unchanged from the original implementation.
 */
export const CLUB_RATING_WEIGHTS: Record<keyof ClubAttributes, number> = {
  reputation: 0.35,
  finances: 0.20,
  youth: 0.15,
  facilities: 0.10,
  fanbase: 0.10,
  stadiumRating: 0.10,
};

export function computeClubOverall(attributes: ClubAttributes): number {
  const raw = (Object.keys(CLUB_RATING_WEIGHTS) as (keyof ClubAttributes)[])
    .reduce((sum, key) => sum + attributes[key] * CLUB_RATING_WEIGHTS[key], 0);
  return Math.round(raw);
}
