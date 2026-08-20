const LEGEND_DLC_KEY = 'football_legacy_legend_mode_unlocked';

export const isLegendModeUnlocked = (): boolean => {
  try {
    return localStorage.getItem(LEGEND_DLC_KEY) === 'true';
  } catch {
    return false;
  }
};

export const unlockLegendMode = (): void => {
  try {
    localStorage.setItem(LEGEND_DLC_KEY, 'true');
  } catch {
    // ignore
  }
};

export const lockLegendMode = (): void => {
  try {
    localStorage.removeItem(LEGEND_DLC_KEY);
  } catch {
    // ignore
  }
};
