import { TimelineEntry, Player } from '../types';
import { IntSimResult } from './international';

export let timelineFeed: TimelineEntry[] = [];

export const TIMELINE_TYPES = {
  TRANSFER: { icon: "🔄", color: "#3498DB" },
  MILESTONE: { icon: "🎯", color: "#2ECC71" },
  AWARD: { icon: "⭐", color: "#F1C40F" },
  TROPHY: { icon: "🏆", color: "#F1C40F" },
  INJURY: { icon: "🩹", color: "#E74C3C" },
  GENERATION: { icon: "👑", color: "#9B59B6" },
  INTERNATIONAL: { icon: "🌐", color: "#1ABC9C" }
};

export function setTimelineFeed(feed: TimelineEntry[]) {
  timelineFeed = feed;
}

export function addTimelineEntry(
  player: Player,
  typeKey: keyof typeof TIMELINE_TYPES,
  title: string,
  description: string
) {
  const typeConfig = TIMELINE_TYPES[typeKey] || TIMELINE_TYPES.MILESTONE;

  const entry: TimelineEntry = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    year: player.year,
    age: player.age,
    generation: player.generation || 1,
    playerName: player.name,
    club: player.club,
    type: typeKey,
    icon: typeConfig.icon,
    color: typeConfig.color,
    title,
    description
  };

  timelineFeed.unshift(entry);
}

export function checkSeasonMilestones(player: Player, seasonApps: number, seasonGoals: number, intResult: IntSimResult) {
  // Debut
  if (player.totalApps === seasonApps) {
    addTimelineEntry(player, "MILESTONE", "Professional Debut", `Made senior debut for ${player.club} at age ${player.age}.`);
  }

  // First Goal
  if (player.totalGoals > 0 && (player.totalGoals - seasonGoals) === 0) {
    addTimelineEntry(player, "MILESTONE", "First Career Goal", `Scored first professional goal for ${player.club}!`);
  }

  // Goals Thresholds
  const prevGoals = player.totalGoals - seasonGoals;
  [50, 100, 250, 500].forEach(target => {
    if (prevGoals < target && player.totalGoals >= target) {
      addTimelineEntry(player, "MILESTONE", `${target} Career Goals!`, `Reached a historic landmark of ${target} career goals.`);
    }
  });

  // Apps Thresholds
  const prevApps = player.totalApps - seasonApps;
  [100, 250, 500, 750].forEach(target => {
    if (prevApps < target && player.totalApps >= target) {
      addTimelineEntry(player, "MILESTONE", `${target} Career Appearances`, `Reached ${target} senior club appearances.`);
    }
  });

  // International Debut & Trophies
  if (intResult && intResult.calledUp) {
    if (player.intCaps === intResult.caps) {
      addTimelineEntry(player, "INTERNATIONAL", "Senior International Debut", `Represented ${player.nationality} in the ${intResult.tournamentName}.`);
    }
    if (intResult.trophyWon) {
      addTimelineEntry(player, "TROPHY", `${intResult.trophyWon} Champion!`, `Won the ${intResult.trophyWon} with ${player.nationality}!`);
    }
  }
}
