import { League, Player, WorldHeadlinePackage, Club } from '../types';
import { LEAGUES_2026, CLUBS_2026, evolveWorldClubsAndOwners } from './database2026';
import { BallonDorResult } from './awards';
import { IntSimResult } from './international';

export let globalNewsFeed: WorldHeadlinePackage[] = [];
export let dynamicLeagues: League[] = JSON.parse(JSON.stringify(LEAGUES_2026));
export let dynamicClubs: Club[] = JSON.parse(JSON.stringify(CLUBS_2026));

export function setWorldFeed(feed: WorldHeadlinePackage[], leagues: League[], clubs?: Club[]) {
  globalNewsFeed = feed;
  if (leagues && leagues.length > 0) {
    dynamicLeagues = leagues;
  }
  if (clubs && clubs.length > 0) {
    dynamicClubs = clubs;
  }
}

export function updateLeagueReputations(): string[] {
  const newsEvents: string[] = [];

  dynamicLeagues.forEach(league => {
    if (league.rep >= 85) {
      const shift = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      league.rep = Math.min(99, Math.max(80, league.rep + shift));
    } else {
      if (Math.random() < 0.25) {
        const boost = Math.floor(Math.random() * 3) + 1; // +1 to +3
        league.rep = Math.min(88, league.rep + boost);
        
        if (boost >= 2) {
          newsEvents.push(`📈 CONTINENTAL RISE: ${league.name} (${league.country}) boosted its UEFA coefficient reputation to ${league.rep}!`);
        }
      }
    }
  });

  dynamicLeagues.sort((a, b) => b.rep - a.rep);
  return newsEvents;
}

export function generateSeasonHeadlines(
  player: Player,
  seasonStats: { goals: number; apps: number; trophiesWon: string[] },
  ballonDorResult: BallonDorResult,
  intResult: IntSimResult,
  extraHeadlines: string[] = []
) {
  const seasonHeadlines: string[] = [];

  // 1. Evolve World Clubs, Ratings & Ownership Takeovers
  const { updatedClubs, headlines: clubHeadlines } = evolveWorldClubsAndOwners(dynamicClubs, player.year);
  dynamicClubs = updatedClubs;
  seasonHeadlines.push(...clubHeadlines);

  // 2. Retirement / Regen headlines
  if (extraHeadlines && extraHeadlines.length > 0) {
    seasonHeadlines.push(...extraHeadlines);
  }

  // 3. Player Performance Headline
  if (seasonStats.goals >= 30) {
    seasonHeadlines.push(`🔥 UNSTOPPABLE: ${player.name} finished the season with an incredible ${seasonStats.goals} goals for ${player.club}!`);
  } else if (seasonStats.trophiesWon.length > 1) {
    seasonHeadlines.push(`🏆🏆 ${seasonStats.trophiesWon.length}-TROPHY SEASON: ${player.name} led ${player.club} to a stunning haul — ${seasonStats.trophiesWon.join(', ')}!`);
  } else if (seasonStats.trophiesWon.length === 1) {
    seasonHeadlines.push(`🏆 CHAMPIONS: ${player.name} led ${player.club} to ${seasonStats.trophiesWon[0]} silverware!`);
  } else {
    seasonHeadlines.push(`⚽ SEASON CONCLUDED: ${player.name} registered ${seasonStats.apps} appearances for ${player.club}.`);
  }

  // 4. Ballon d'Or Headline
  if (ballonDorResult.isUserWinner) {
    seasonHeadlines.push(`👑 GOLDEN BOY: ${player.name} crowned Ballon d'Or winner!`);
  } else {
    seasonHeadlines.push(`⭐ BALLON D'OR: ${ballonDorResult.winner.name} (${ballonDorResult.winner.club}) named world's best player!`);
  }

  // 5. International Headline
  if (intResult && intResult.calledUp && intResult.trophyWon) {
    seasonHeadlines.push(`🌐 GLORY FOR ${player.nationality.toUpperCase()}: ${player.name} lifted the ${intResult.trophyWon}!`);
  }

  // 6. Dynamic League Coefficients
  const repNews = updateLeagueReputations();
  seasonHeadlines.push(...repNews);

  globalNewsFeed.unshift({
    year: player.year,
    headlines: seasonHeadlines
  });
}
