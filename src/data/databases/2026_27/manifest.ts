import { DatabaseManifest } from '../../types/database';
import { COUNTRIES_2026_27 } from './countries';

export const MANIFEST_2026_27: DatabaseManifest = {
  id: '2026_27',
  displayName: '2026/27 European Season',
  version: '0.3.0',
  includedRegions: COUNTRIES_2026_27.map(c => c.id),
  minSupportedGameVersion: '0.3.0',
};
