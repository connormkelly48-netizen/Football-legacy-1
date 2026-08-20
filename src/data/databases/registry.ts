/**
 * DATABASE REGISTRY
 * ------------------
 * This is the single place a new database gets registered — whether that's
 * a future season update, a Historical Database DLC (1999_00, 2007_08,
 * etc.), or a Continental Expansion DLC.
 *
 * `databaseLoader.ts` reads from this registry and never hard-codes a
 * database. Adding DLC support at runtime means adding one entry here;
 * no changes to the loader, validator, or any component are required.
 *
 * Historical databases are prepared for in
 * `src/data/databases/historical/roadmap.ts` but are NOT registered here
 * yet — they have no populated data, and an empty FootballDatabase would
 * fail validation (by design: empty leagues/clubs indicate corruption, not
 * legitimate content). Registering a historical database is a one-line
 * addition once its data exists.
 */
import { FootballDatabase } from '../types/database';
import { DATABASE_2026_27 } from './2026_27';

export const DATABASE_REGISTRY: Record<string, FootballDatabase> = {
  [DATABASE_2026_27.manifest.id]: DATABASE_2026_27,
};

/** The database new saves are created against unless the player selects otherwise. */
export const DEFAULT_DATABASE_ID = DATABASE_2026_27.manifest.id;

export function isDatabaseInstalled(databaseId: string): boolean {
  return databaseId in DATABASE_REGISTRY;
}

export function listInstalledDatabaseIds(): string[] {
  return Object.keys(DATABASE_REGISTRY);
}
