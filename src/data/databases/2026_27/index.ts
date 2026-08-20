import { FootballDatabase } from '../../types/database';
import { MANIFEST_2026_27 } from './manifest';
import { COUNTRIES_2026_27 } from './countries';
import { LEAGUES_2026_27 } from './leagues';
import { CLUBS_2026_27 } from './clubs';
import { OWNER_ENTITIES_2026_27 } from './ownership';
import { COMPETITIONS_2026_27 } from './competitions';

export const DATABASE_2026_27: FootballDatabase = {
  manifest: MANIFEST_2026_27,
  countries: COUNTRIES_2026_27,
  leagues: LEAGUES_2026_27,
  clubs: CLUBS_2026_27,
  ownerEntities: OWNER_ENTITIES_2026_27,
  competitions: COMPETITIONS_2026_27,
};
