/**
 * HISTORICAL DATABASE ROADMAP
 * ----------------------------
 * This is deliberately NOT a `FootballDatabase` — an empty one (0 leagues,
 * 0 clubs) would fail `validateDatabase` by design, since empty content
 * indicates corruption in a real database, not "not built yet."
 *
 * This file exists so the engine, UI, and DLC store screen can list what's
 * planned/coming without needing a populated database behind each entry.
 * When an era's data is actually built, the workflow is:
 *   1. Create `src/data/databases/historical/<era>/` following the same
 *      shape as `src/data/databases/2026_27/` (manifest, countries,
 *      leagues, clubs/, ownership, competitions, index.ts).
 *   2. Add one line to `DATABASE_REGISTRY` in `../registry.ts`.
 *   3. Flip `populated: true` below.
 * No engine, loader, or component changes are needed for either step.
 */
export interface HistoricalDatabaseRoadmapEntry {
  /** Matches the eventual DatabaseManifest.id once built, e.g. "1999_00". */
  id: string;
  displayName: string;
  populated: boolean;
  notes?: string;
}

export const HISTORICAL_DATABASE_ROADMAP: HistoricalDatabaseRoadmapEntry[] = [
  { id: '1992_93', displayName: '1992/93 Season', populated: false, notes: 'Inaugural Premier League season.' },
  { id: '1999_00', displayName: '1999/00 Season', populated: false, notes: 'Treble-era Manchester United, pre-Financial Fair Play landscape.' },
  { id: '2003_04', displayName: '2003/04 Season', populated: false, notes: 'Arsenal "Invincibles" season.' },
  { id: '2007_08', displayName: '2007/08 Season', populated: false, notes: 'Pre-financial-crisis European football, early Abu Dhabi/Gulf ownership wave beginning.' },
  { id: '2012_13', displayName: '2012/13 Season', populated: false, notes: 'Post-Financial Fair Play introduction.' },
  { id: '2015_16', displayName: '2015/16 Season', populated: false, notes: 'Leicester City title-winning season — high narrative value for a historical mode.' },
];
