import { ClubRecord } from '../../../types/database';

import { CLUBS_ENG } from './england';
import { CLUBS_ESP } from './spain';
import { CLUBS_GER } from './germany';
import { CLUBS_ITA } from './italy';
import { CLUBS_FRA } from './france';
import { CLUBS_POR } from './portugal';
import { CLUBS_NED } from './netherlands';
import { CLUBS_BEL } from './belgium';
import { CLUBS_AUT } from './austria';
import { CLUBS_SUI } from './switzerland';
import { CLUBS_SCO } from './scotland';
import { CLUBS_IRL } from './ireland';
import { CLUBS_TUR } from './turkey';

export const CLUBS_2026_27: ClubRecord[] = [
  ...CLUBS_ENG,
  ...CLUBS_ESP,
  ...CLUBS_GER,
  ...CLUBS_ITA,
  ...CLUBS_FRA,
  ...CLUBS_POR,
  ...CLUBS_NED,
  ...CLUBS_BEL,
  ...CLUBS_AUT,
  ...CLUBS_SUI,
  ...CLUBS_SCO,
  ...CLUBS_IRL,
  ...CLUBS_TUR,
];
