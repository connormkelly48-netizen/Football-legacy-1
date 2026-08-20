import { Player, Superstar, Position } from '../types';
import { CLUBS_2026 } from './database2026';

export const INITIAL_SUPERSTARS: Superstar[] = [
  { id: "mbappe", name: "Kylian Mbappé", club: "Real Madrid", ovr: 91, pos: "ST", age: 27, peakOvr: 94, nationality: "France", loyalty: 0.35, yearsAtClub: 1 },
  { id: "haaland", name: "Erling Haaland", club: "Manchester City", ovr: 90, pos: "ST", age: 26, peakOvr: 94, nationality: "Norway", loyalty: 0.55, yearsAtClub: 3 },
  { id: "vini", name: "Vinícius Júnior", club: "Real Madrid", ovr: 89, pos: "LW", age: 26, peakOvr: 92, nationality: "Brazil", loyalty: 0.55, yearsAtClub: 6 },
  { id: "bellingham", name: "Jude Bellingham", club: "Real Madrid", ovr: 88, pos: "CAM", age: 23, peakOvr: 93, nationality: "England", loyalty: 0.45, yearsAtClub: 2 },
  { id: "yamal", name: "Lamine Yamal", club: "FC Barcelona", ovr: 87, pos: "RW", age: 19, peakOvr: 95, nationality: "Spain", loyalty: 0.75, yearsAtClub: 2 },
  { id: "wirtz", name: "Florian Wirtz", club: "Bayer Leverkusen", ovr: 87, pos: "CAM", age: 23, peakOvr: 92, nationality: "Germany", loyalty: 0.4, yearsAtClub: 4 },
  { id: "musiala", name: "Jamal Musiala", club: "Bayern Munich", ovr: 87, pos: "CAM", age: 23, peakOvr: 93, nationality: "Germany", loyalty: 0.85, yearsAtClub: 5 },
  { id: "rodri", name: "Rodri", club: "Manchester City", ovr: 89, pos: "CDM", age: 30, peakOvr: 90, nationality: "Spain", loyalty: 0.6, yearsAtClub: 5 },
  { id: "lautaro", name: "Lautaro Martínez", club: "Inter Milan", ovr: 87, pos: "ST", age: 28, peakOvr: 89, nationality: "Argentina", loyalty: 0.65, yearsAtClub: 5 },
  { id: "kane", name: "Harry Kane", club: "Bayern Munich", ovr: 88, pos: "ST", age: 32, peakOvr: 90, nationality: "England", loyalty: 0.4, yearsAtClub: 2 },
  { id: "salah", name: "Mohamed Salah", club: "Liverpool", ovr: 87, pos: "RW", age: 34, peakOvr: 90, nationality: "Egypt", loyalty: 0.6, yearsAtClub: 8 },
  { id: "debruyne", name: "Kevin De Bruyne", club: "Manchester City", ovr: 87, pos: "CM", age: 34, peakOvr: 91, nationality: "Belgium", loyalty: 0.5, yearsAtClub: 9 }
];

const NAMES_BY_NATION: Record<string, { first: string[]; last: string[] }> = {
  France: {
    first: ["Kylian", "Antoine", "Lucas", "Hugo", "Enzo", "Mathieu", "Rayane", "Aurélien", "Jules"],
    last: ["Dupont", "Mercier", "Moreau", "Laurent", "Giroud", "Camavinga", "Dubois", "Fontaine"]
  },
  Spain: {
    first: ["Lamine", "Pedro", "Gavi", "Marco", "Alejandro", "Pablo", "Hector", "Iker"],
    last: ["Garcia", "Torres", "Lopez", "Rodriguez", "Fernandez", "Gomez", "Ruiz", "Navarro"]
  },
  Brazil: {
    first: ["Thiago", "Gabriel", "Vinicius", "Rodrygo", "Lucas", "Matheus", "Endrick", "Caio"],
    last: ["Silva", "Santos", "Oliveira", "Ribeiro", "Lima", "Ferreira", "Costa", "Souza"]
  },
  England: {
    first: ["Jude", "Harry", "Liam", "Ethan", "Cole", "Declan", "Bukayo", "Archie"],
    last: ["Smith", "Jones", "Walker", "Palmer", "Rice", "Alexander", "Kane", "Greenwood"]
  },
  Germany: {
    first: ["Florian", "Jamal", "Noah", "Leon", "Julian", "Lukas", "Maximilian", "Felix"],
    last: ["Schmidt", "Weber", "Müller", "Hoffmann", "Schneider", "Fischer", "Wagner", "Becker"]
  },
  Argentina: {
    first: ["Julian", "Lautaro", "Enzo", "Alexis", "Mateo", "Thiago", "Franco", "Nicolas"],
    last: ["Alvarez", "Fernandez", "Mac Allister", "Martinez", "Gomez", "Romero", "Benitez"]
  },
  Italy: {
    first: ["Sandro", "Marco", "Federico", "Nicolò", "Gianluca", "Davide", "Mateo"],
    last: ["Rossi", "Moretti", "Bastoni", "Chiesa", "Barella", "Donnarumma", "Pellegrini"]
  },
  Portugal: {
    first: ["Rafael", "João", "Bernardo", "Gonçalo", "Diogo", "Vitinha", "Ruben"],
    last: ["Neves", "Silva", "Dias", "Felix", "Cancelo", "Fernandes", "Ramos"]
  },
  Netherlands: {
    first: ["Cody", "Xavi", "Frenkie", "Virgil", "Ryan", "Sven", "Denzel"],
    last: ["de Jong", "Simons", "Gakpo", "van Dijk", "Gravenberch", "de Ligt", "Dumfries"]
  },
  Norway: {
    first: ["Erling", "Martin", "Oscar", "Sander", "Leo", "Kristoffer"],
    last: ["Haaland", "Ødegaard", "Bobb", "Berge", "Ajer", "Sørloth"]
  }
};

const CLUBS = ["Real Madrid", "Manchester City", "FC Barcelona", "Bayern Munich", "Paris Saint-Germain", "Arsenal", "Liverpool", "Inter Milan", "Chelsea", "Juventus"];
const NATIONS = Object.keys(NAMES_BY_NATION);
const POSITIONS: Position[] = ["ST", "CAM", "LW", "RW", "CM", "CB"];

export function generateNewGenSuperstar(year: number): Superstar {
  const nationality = NATIONS[Math.floor(Math.random() * NATIONS.length)];
  const pool = NAMES_BY_NATION[nationality];
  const firstName = pool.first[Math.floor(Math.random() * pool.first.length)];
  const lastName = pool.last[Math.floor(Math.random() * pool.last.length)];
  const club = CLUBS[Math.floor(Math.random() * CLUBS.length)];
  const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  const age = 16 + Math.floor(Math.random() * 4); // 16 - 19 y/o
  const ovr = 80 + Math.floor(Math.random() * 6); // 80 - 85 OVR
  const peakOvr = 91 + Math.floor(Math.random() * 5); // 91 - 95 OVR

  return {
    id: `regen_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: `${firstName} ${lastName}`,
    club,
    ovr,
    pos,
    age,
    peakOvr,
    nationality,
    isRegen: true,
    loyalty: 0.2 + Math.random() * 0.6, // 0.2-0.8, randomized per player
    yearsAtClub: 0
  };
}

/** Mirrors rollAgeRandomComponent in quickfireEngine.ts — same system, applied to NPCs. */
function rollSuperstarAgeRandom(age: number): number {
  if (age <= 22) return Math.floor(Math.random() * 13) - 5;   // -5 to +7
  if (age <= 25) return Math.floor(Math.random() * 11) - 5;   // -5 to +5
  if (age <= 32) return Math.floor(Math.random() * 7) - 3;    // -3 to +3
  return Math.floor(Math.random() * 11) - 7;                  // -7 to +3
}

/**
 * Superstars don't have a per-match simulation like the player, so this
 * substitutes a "how the season generally went" signal based on how much
 * room they have below their own peak — still genuinely random, not a
 * guaranteed trend either direction.
 *
 * Includes regression-to-mean pressure: sustaining true elite form (86+)
 * gets progressively harder the longer the streak runs. Without this, a
 * player who reaches their peak by their mid-20s could plausibly just
 * hover there through their entire prime with nothing pushing them back
 * down — which doesn't match reality. A Messi/Ronaldo-length decade of
 * uninterrupted world-class form is meant to be a genuine outlier, not
 * the median outcome for a top player.
 */
function computeSuperstarPerformanceComponent(currentOvr: number, peakOvr: number, eliteStreak: number): number {
  const room = peakOvr - currentOvr;
  let base: number;
  if (room > 5) base = Math.floor(Math.random() * 3);              // 0 to +2, plenty of room to still improve
  else if (room >= 0) base = Math.floor(Math.random() * 3) - 1;    // -1 to +1, at/near their peak
  else base = -(Math.floor(Math.random() * 2) + 1);                // -1 to -2, already past their real peak

  if (currentOvr >= 86 && eliteStreak > 3) {
    base -= Math.min(3, Math.floor((eliteStreak - 3) / 2) + 1);
  }

  return base;
}

interface SuperstarEventRoll {
  component: number;
  headline: string | null;
}

/**
 * Same category of event system as the player (see rollCareerEvent in
 * quickfireEngine.ts) — including a serious-injury or fallout-with-club
 * possibility for ANY superstar, at ANY point in their career. This is
 * deliberate: a 10-15 year Messi/Ronaldo-style duel at the top is a
 * once-in-a-generation outcome, not the default. Without real risk of
 * disruption, the same handful of names would dominate the Ballon d'Or
 * conversation identically in every single save.
 */
function rollSuperstarEvent(star: Superstar): SuperstarEventRoll {
  const isNearPeak = star.ovr >= star.peakOvr - 2;
  const severeChance = isNearPeak ? 0.03 : 0.015;
  const roll = Math.random();
  let cumulative = severeChance;

  if (roll < cumulative) {
    const penalty = Math.floor(Math.random() * 6) + 5; // 5-10, permanent
    return {
      component: -penalty,
      headline: `💥 SHOCK BLOW: ${star.name} suffers a serious injury that could define the rest of their career.`,
    };
  }
  cumulative += 0.05;
  if (roll < cumulative) {
    return {
      component: -(Math.floor(Math.random() * 3) + 2), // -2 to -4
      headline: `🤕 SETBACK: ${star.name} battles fitness problems through a disrupted season.`,
    };
  }
  cumulative += 0.025;
  if (roll < cumulative) {
    // Falling out with the club — a real, if rare, career disruption distinct from injury.
    return {
      component: -(Math.floor(Math.random() * 3) + 1), // -1 to -3
      headline: `⚠️ TENSION: Reports emerge of a rift between ${star.name} and ${star.club} that's affecting form.`,
    };
  }
  cumulative += 0.06;
  if (roll < cumulative) {
    return {
      component: Math.floor(Math.random() * 3) + 3, // +3 to +5
      headline: `⭐ BREAKOUT: ${star.name} produces the form of their career this season.`,
    };
  }
  return { component: 0, headline: null };
}

/**
 * Rolls whether this superstar transfers this season, and to where.
 * Wanderlust rises with time at the current club and falls with loyalty;
 * older players get a "one last adventure" bump. Destination is picked
 * from the real club database, weighted toward clubs whose rating roughly
 * matches the player's level.
 */
function rollSuperstarTransfer(star: Superstar): { newClub: string; headline: string } | null {
  const loyalty = star.loyalty ?? 0.5;
  const tenure = star.yearsAtClub ?? 0;
  let chance = 0.025 + tenure * 0.008 - loyalty * 0.05;
  if (star.age >= 32) chance += 0.025; // late-career "one last adventure" moves
  chance = Math.max(0.008, Math.min(0.3, chance));

  if (Math.random() >= chance) return null;

  const candidates = CLUBS_2026.filter(c =>
    c.name !== star.club && Math.abs(c.rating - star.ovr) <= 10
  );
  if (candidates.length === 0) return null;

  const destination = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    newClub: destination.name,
    headline: `🔄 TRANSFER: ${star.name} completes a move to ${destination.name}!`,
  };
}

export function advanceSuperstars(
  superstars: Superstar[],
  currentYear: number
): { updatedSuperstars: Superstar[]; retirementHeadlines: string[] } {
  const retirementHeadlines: string[] = [];
  const updatedSuperstars = superstars.map(star => {
    if (star.isRetired) return star;

    const newAge = star.age + 1;

    const randomComponent = rollSuperstarAgeRandom(newAge);
    const eliteStreak = star.ovr >= 86 ? (star.eliteStreak ?? 0) + 1 : 0;
    const performanceComponent = computeSuperstarPerformanceComponent(star.ovr, star.peakOvr, eliteStreak);
    const eventRoll = rollSuperstarEvent(star);
    if (eventRoll.headline) retirementHeadlines.push(eventRoll.headline);

    const delta = randomComponent + performanceComponent + eventRoll.component;
    let newOvr = Math.max(55, Math.min(99, star.ovr + delta));

    const shouldRetire =
      newAge >= 37 ||
      (newAge >= 34 && newOvr < 78) ||
      (newAge >= 35 && Math.random() < 0.45);

    if (shouldRetire) {
      retirementHeadlines.push(
        `💔 RETIREMENT LEGEND: ${star.name} (${star.club}) has officially retired from professional football at age ${newAge}!`
      );
      return {
        ...star,
        age: newAge,
        ovr: newOvr,
        isRetired: true,
        retiredYear: currentYear
      };
    }

    // Transfer roll — happens after the injury/event roll so a player
    // who just fell out with their club is more narratively primed to
    // actually leave (their transfer chance isn't directly boosted by the
    // event, but the two showing up in the same season reads naturally).
    const transferResult = rollSuperstarTransfer({ ...star, age: newAge, ovr: newOvr });
    if (transferResult) {
      retirementHeadlines.push(transferResult.headline);
      return {
        ...star,
        age: newAge,
        ovr: newOvr,
        club: transferResult.newClub,
        yearsAtClub: 0,
        eliteStreak
      };
    }

    return {
      ...star,
      age: newAge,
      ovr: newOvr,
      eliteStreak,
      yearsAtClub: (star.yearsAtClub ?? 0) + 1
    };
  });

  const activeCount = updatedSuperstars.filter(s => !s.isRetired && s.ovr >= 82).length;

  // Floor raised from the original 9/10 — a deeper pool of genuine
  // contenders means an elite user player is racing a bigger field every
  // season, not a small fixed handful of names, which was part of why a
  // sufficiently high-OVR player could dominate the vote almost every year.
  if (activeCount < 12) {
    const numToGenerate = Math.min(3, 13 - activeCount);
    for (let i = 0; i < numToGenerate; i++) {
      const regen = generateNewGenSuperstar(currentYear);
      updatedSuperstars.push(regen);
      retirementHeadlines.push(
        `🌟 NEW GENERATION PRODIGY: ${regen.name} (${regen.age}y/o) breaks into world football at ${regen.club} (${regen.ovr} OVR)!`
      );
    }
  }

  return {
    updatedSuperstars,
    retirementHeadlines
  };
}

export interface MediaVerdict {
  status: string;
  text: string;
  color: string;
}

export interface SeasonPerfStats {
  apps: number;
  goals: number;
  assists: number;
  avgRating: number;
  ovrGrowth?: number;
}

/**
 * Contextual & Age-Aware Media Verdict logic.
 * Never criticizes young players simply for not reaching an arbitrary potential!
 */
export function getMediaVerdict(player: Player, seasonStats?: SeasonPerfStats): MediaVerdict {
  const age = player.age;
  const stats = seasonStats || { apps: 20, goals: 5, assists: 3, avgRating: 7.1, ovrGrowth: 1 };
  const totalContrib = stats.goals + stats.assists;

  // 1. TEENAGERS (Age 15 - 18)
  if (age <= 18) {
    if (totalContrib >= 10 || stats.avgRating >= 7.3) {
      return {
        status: "AHEAD OF SCHEDULE",
        text: `Outstanding performances for an 18y/o (${stats.goals}G/${stats.assists}A, ${stats.avgRating} avg rating)! Exceeding early expectations.`,
        color: "#F1C40F"
      };
    }
    if (stats.apps >= 12 || stats.avgRating >= 7.0) {
      return {
        status: "EXCELLENT DEVELOPMENT",
        text: `Excellent progress for a ${age}-year-old playing senior football. Gaining invaluable match experience.`,
        color: "#2ECC71"
      };
    }
    if (stats.apps >= 5) {
      return {
        status: "SETTLING INTO PROFESSIONAL FOOTBALL",
        text: `Adapting nicely to the intensity of senior football. Positive early glimpses for a ${age}yo.`,
        color: "#3498DB"
      };
    }
    return {
      status: "PROMISING YOUNG TALENT",
      text: `Impressing coaching staff in training. Plenty of time to develop as a young prospect.`,
      color: "#9B59B6"
    };
  }

  // 2. YOUNG PROSPECTS (Age 19 - 22)
  if (age <= 22) {
    if (totalContrib >= 18 || stats.avgRating >= 7.6) {
      return {
        status: "BREAKTHROUGH CAMPAIGN",
        text: `Sensational breakout season! Dominating matches and turning heads across European scouts.`,
        color: "#F1C40F"
      };
    }
    if (stats.avgRating >= 7.1 && stats.apps >= 15) {
      return {
        status: "DEVELOPING WELL",
        text: `Developing steadily at a competitive level with consistent first-team involvement.`,
        color: "#2ECC71"
      };
    }
    if (stats.apps >= 10 && stats.avgRating >= 6.8) {
      return {
        status: "ONE TO WATCH",
        text: `Displaying bright flashes of technical instinct as first-team minutes increase.`,
        color: "#3498DB"
      };
    }
    if (stats.apps < 8) {
      return {
        status: "STRUGGLING FOR MINUTES",
        text: `Limited involvement this campaign. Needs additional starter minutes to maintain progress.`,
        color: "#E67E22"
      };
    }
    if (stats.avgRating < 6.7) {
      return {
        status: "CAREER STALLING",
        text: `Form has dipped this season. Media pundits encourage a loan move to regain sharp rhythm.`,
        color: "#E74C3C"
      };
    }
    return {
      status: "CONSISTENT SQUAD MEMBER",
      text: `Solid rotational role provided steady squad depth over the campaign.`,
      color: "#3498DB"
    };
  }

  // 3. PRIME YEARS (Age 23 - 29)
  if (age <= 29) {
    if (stats.avgRating >= 7.8 || totalContrib >= 25) {
      return {
        status: "WORLD CLASS PERFORMER",
        text: `Dominating matches week in, week out. Considered a marquee reference point for ${player.club}.`,
        color: "#F1C40F"
      };
    }
    if (stats.avgRating >= 7.2) {
      return {
        status: "CONSISTENT PERFORMER",
        text: `Reliable, high-grade contributions throughout the season for ${player.club}.`,
        color: "#2ECC71"
      };
    }
    if (stats.apps >= 20) {
      return {
        status: "RELIABLE SQUAD PLAYER",
        text: `Solid squad contributor executing tactical roles effectively.`,
        color: "#3498DB"
      };
    }
    if (stats.avgRating < 6.7) {
      return {
        status: "POOR SEASON",
        text: `Underwhelming campaign failing to leave a major mark on the pitch.`,
        color: "#E74C3C"
      };
    }
    return {
      status: "PLATEAUING",
      text: `Performances have leveled off. Seeking extra consistency to make the next step.`,
      color: "#E67E22"
    };
  }

  // 4. VETERANS (Age 30+)
  if (stats.avgRating >= 7.3) {
    return {
      status: "AGELESS VETERAN MASTERCLASS",
      text: `Defying age with composed leadership and tactical brilliance on matchdays.`,
      color: "#2ECC71"
    };
  }
  if (stats.ovrGrowth && stats.ovrGrowth < 0) {
    return {
      status: "DECLINING",
      text: `Natural physical decline taking its toll, though experience remains invaluable.`,
      color: "#95A5A6"
    };
  }
  return {
    status: "EXPERIENCED LEADER",
    text: `Guiding younger teammates with professionalism and positional wisdom.`,
    color: "#3498DB"
  };
}

export function getMediaPotentialStatus(player: Player): MediaVerdict {
  return getMediaVerdict(player);
}

export interface Contender {
  name: string;
  club: string;
  ovr: number;
  score: number;
  isUser: boolean;
}

export interface YouthAward {
  title: string;
  description: string;
  icon: string;
}

export interface BallonDorResult {
  winner: Contender;
  isUserWinner: boolean;
  userRank: number | null; // Null or number if in top rankings
  top10: Contender[]; // Full Top 10 list
  youthAwards: YouthAward[];
  userPoints: number;
  userEligible: boolean;
}

/**
 * Reworked Ballon d'Or calculation with strict entry thresholds (78+ OVR or Top 20 performance)
 * and Top 10 rankings display.
 */
export function calculateBallonDor(
  player: Player,
  seasonStats: { goals: number; assists: number; avgRating: number; trophyWon: boolean; intTrophyWon?: boolean; apps?: number },
  superstars: Superstar[] = INITIAL_SUPERSTARS
): BallonDorResult {
  const activeStars = superstars.filter(s => !s.isRetired);

  // Generate dynamic performance scores for world-class CPU superstars
  const contenders: Contender[] = activeStars.map(star => {
    const simRating = 7.1 + Math.random() * 1.1; // 7.1 to 8.2 avg rating
    const simGoals = star.pos === 'ST' ? Math.floor(Math.random() * 28) + 16 : Math.floor(Math.random() * 14) + 4;
    const simAssists = star.pos === 'CAM' || star.pos === 'LW' || star.pos === 'RW' ? Math.floor(Math.random() * 16) + 7 : Math.floor(Math.random() * 8) + 2;
    const simTrophies = Math.random() > 0.55 ? 30 : 0;
    const clubPrestige = (star.club === "Real Madrid" || star.club === "Manchester City" || star.club === "Bayern Munich") ? 20 : 10;

    // Multi-factor weighted formula
    const score = (star.ovr * 3.5) + (simRating * 18) + (simGoals * 1.5) + (simAssists * 1.0) + simTrophies + clubPrestige + (Math.random() * 20 - 10);

    return {
      name: star.name,
      club: star.club,
      ovr: star.ovr,
      score,
      isUser: false
    };
  });

  // Calculate User Player Score
  const trophyBonus = (seasonStats.trophyWon ? 30 : 0) + (seasonStats.intTrophyWon ? 50 : 0);

  // "Voter fatigue" — real Ballon d'Or voters spread the award around even
  // among genuine all-time greats; nobody wins it 8-9 years running. Each
  // consecutive prior win makes this season's vote harder to win, capping
  // out at a steep penalty so a dominant run naturally breaks itself up.
  const priorStreak = player.ballonDorStreak ?? 0;
  const fatiguePenalty = Math.min(0.40, priorStreak * 0.10);

  // Same scale of season-to-season randomness the NPC contenders get
  // (Math.random() * 20 - 10) — without this the user's score was a near-
  // deterministic function of their stats, so a truly elite, consistent
  // player could out-score the entire NPC field almost every single
  // season purely on lower variance, not on actually having the better
  // year. Real award races have genuine unpredictable swing.
  const userNoise = Math.random() * 20 - 10;

  const rawUserScore = (player.ovr * 3.3) +
                    (seasonStats.avgRating * 20) +
                    (seasonStats.goals * 1.5) +
                    (seasonStats.assists * 1.0) +
                    trophyBonus +
                    userNoise;
  const userScore = rawUserScore * (1 - fatiguePenalty);

  // Strict Threshold Check:
  // Must be 78+ OVR OR have a generational breakout score to qualify for Ballon d'Or votes.
  const isUserEligible = player.ovr >= 78 || userScore >= 420;

  if (isUserEligible) {
    contenders.push({
      name: player.name,
      club: player.club,
      ovr: player.ovr,
      score: userScore,
      isUser: true
    });
  }

  // Sort candidates by score
  contenders.sort((a, b) => b.score - a.score);

  // Top 10 List
  const top10 = contenders.slice(0, 10);
  const winner = contenders[0];
  const isUserWinner = winner.isUser;
  
  const userIndex = contenders.findIndex(c => c.isUser);
  const userRank = isUserEligible && userIndex !== -1 ? userIndex + 1 : null;

  // Youth Awards for Young Players (<= 21y/o)
  const youthAwards: YouthAward[] = [];
  const apps = seasonStats.apps || 20;

  if (player.age <= 21) {
    // 1. European Golden Boy Award
    if ((player.ovr >= 74 || seasonStats.goals + seasonStats.assists >= 12) && seasonStats.avgRating >= 7.2) {
      youthAwards.push({
        title: "🏆 Golden Boy Winner",
        description: "Voted the best young under-21 player in European football!",
        icon: "GoldenBoy"
      });
    } else if (player.ovr >= 68 && seasonStats.avgRating >= 7.0 && apps >= 15) {
      youthAwards.push({
        title: "⭐ Golden Boy Shortlist",
        description: "Nominated among the top 10 under-21 prospects in Europe.",
        icon: "Shortlist"
      });
    }

    // 2. League Young Player of the Season
    if (seasonStats.avgRating >= 7.2 && apps >= 15) {
      youthAwards.push({
        title: "🥇 League Young Player of the Year",
        description: `Selected as the official Young Player of the Season in ${player.club}!`,
        icon: "YoungPlayer"
      });
    }

    // 3. World Rising Star XI
    if (apps >= 12 && seasonStats.avgRating >= 6.9) {
      youthAwards.push({
        title: "🌟 World Rising Star XI Selection",
        description: "Named in the international Under-21 Team of the Year.",
        icon: "RisingStar"
      });
    }
  }

  return {
    winner,
    isUserWinner,
    userRank,
    top10,
    youthAwards,
    userPoints: Math.round(userScore),
    userEligible: isUserEligible
  };
}

export function calculateGoldenShoe(player: Player, seasonGoals: number): boolean {
  const isEligiblePos = player.position === 'ST' || player.position === 'LW' || player.position === 'RW';
  return isEligiblePos && seasonGoals >= 32 && player.ovr >= 82;
}
