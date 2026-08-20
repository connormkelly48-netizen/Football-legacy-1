import { Player } from '../types';

export const NATION_THRESHOLDS: Record<string, number> = {
  // Top Tier Giants
  "France": 82, "England": 81, "Spain": 81, "Germany": 80, "Italy": 80, "Portugal": 80, "Netherlands": 79,
  // Mid Tier Nations
  "Belgium": 77, "Croatia": 76, "Denmark": 75, "Scotland": 73, "Turkey": 74, "Switzerland": 75, "Austria": 74,
  // Lower Tier / Rising Nations
  "Ireland": 64, "Wales": 66, "Northern Ireland": 62, "Norway": 72, "Sweden": 71, "Poland": 72, "Czechia": 70,
  // Default for all other UEFA nations
  "DEFAULT": 60
};

export interface TournamentInfo {
  id: string;
  name: string;
  prestige: number;
  matches: number;
}

export function getInternationalTournament(year: number): TournamentInfo {
  const cycle = year % 4;
  switch (cycle) {
    case 0:
      return { id: "WC", name: "FIFA World Cup", prestige: 100, matches: 7 };
    case 1:
      return { id: "NL", name: "UEFA Nations League", prestige: 50, matches: 6 };
    case 2:
      return { id: "EURO", name: "UEFA European Championship", prestige: 90, matches: 6 };
    case 3:
    default:
      return { id: "WCQ", name: "World Cup Qualifiers", prestige: 40, matches: 6 };
  }
}

export interface IntSimResult {
  calledUp: boolean;
  tournamentName?: string;
  isCaptain?: boolean;
  caps: number;
  goals: number;
  assists: number;
  trophyWon: string | null;
  reason?: string;
}

export function simulateInternationalDuty(player: Player): IntSimResult {
  const threshold = NATION_THRESHOLDS[player.nationality] || NATION_THRESHOLDS["DEFAULT"];
  const isEligible = player.ovr >= threshold && player.age <= 36;

  if (!isEligible) {
    return {
      calledUp: false,
      reason: `OVR (${player.ovr}) below national threshold (${threshold}) for ${player.nationality}.`,
      caps: 0,
      goals: 0,
      assists: 0,
      trophyWon: null
    };
  }

  const tournament = getInternationalTournament(player.year);
  const maxMatches = tournament.matches;
  const caps = Math.min(maxMatches, Math.floor(Math.random() * 3) + (maxMatches - 2));

  let goalMultiplier = 0.1;
  if (player.position === 'ST') goalMultiplier = 0.55;
  else if (player.position === 'CAM' || player.position === 'LW' || player.position === 'RW') goalMultiplier = 0.35;
  else if (player.position === 'CM' || player.position === 'LM' || player.position === 'RM') goalMultiplier = 0.15;
  else if (player.position === 'CB' || player.position === 'LB' || player.position === 'RB') goalMultiplier = 0.05;
  else if (player.position === 'GK') goalMultiplier = 0.0;

  const goals = player.position === 'GK' ? 0 : Math.floor(caps * goalMultiplier * (player.ovr / 75) * (Math.random() * 0.8 + 0.5));
  const assists = player.position === 'GK' ? 0 : Math.floor(caps * 0.2 * (Math.random() + 0.5));

  const isCaptain = (player.intCaps >= 40 || player.age >= 30) && player.ovr >= threshold + 3;

  let trophyWon: string | null = null;
  const nationTier = threshold >= 79 ? 1 : (threshold >= 70 ? 2 : 3);

  if (tournament.id === "WC" || tournament.id === "EURO") {
    const winProb = nationTier === 1 ? 0.22 : (nationTier === 2 ? 0.07 : 0.01);
    if (Math.random() < winProb) {
      trophyWon = tournament.name;
    }
  } else if (tournament.id === "NL") {
    const winProb = nationTier === 1 ? 0.30 : (nationTier === 2 ? 0.10 : 0.02);
    if (Math.random() < winProb) {
      trophyWon = tournament.name;
    }
  }

  return {
    calledUp: true,
    tournamentName: tournament.name,
    isCaptain,
    caps,
    goals,
    assists,
    trophyWon
  };
}
