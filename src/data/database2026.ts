/**
 * COMPATIBILITY LAYER
 * --------------------
 * This file preserves the exact public API that the rest of the app already
 * depends on (LEAGUES_2026, CLUBS_2026, MULTI_CLUB_GROUPS, getClubByName,
 * getEffectiveClubPhilosophy, evolveWorldClubsAndOwners, generateClubOffers)
 * so that no component or engine file needed to change as part of this
 * architecture migration.
 *
 * The actual source of truth now lives in `src/data/databases/2026_27/` and
 * is loaded through the single entry point in `src/data/databaseLoader.ts`.
 * Swapping to a different database in future only requires changing the
 * `loadDatabase(...)` call below.
 */
import { League, Club, TransferOffer, Player, ClubPhilosophy, OwnerPersonality, MultiClubGroup } from '../types';
import { loadDatabase } from './databaseLoader';

const loaded = loadDatabase('2026_27');

export const LEAGUES_2026: League[] = loaded.leagues;
export const CLUBS_2026: Club[] = loaded.clubs;
export const MULTI_CLUB_GROUPS: MultiClubGroup[] = loaded.multiClubGroups;
/** Active database identity, for save-slot versioning (see SaveSlot.databaseId/databaseVersion). */
export const ACTIVE_DATABASE_ID: string = loaded.databaseId;
export const ACTIVE_DATABASE_VERSION: string = loaded.databaseVersion;

export function getClubByName(name: string): Club {
  const found = CLUBS_2026.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (found) return found;
  return {
    id: `club_${name.toLowerCase().replace(/\s+/g, '')}`,
    name: name,
    leagueId: "ENG_PREM",
    rating: 75,
    color: "#2ECC71",
    secondaryColor: "#1E1E1E",
    philosophy: "BALANCED",
    stadium: "Local Arena",
    finances: 70
  };
}

export function getEffectiveClubPhilosophy(club: Club, year: number): ClubPhilosophy {
  if (club.owner) {
    switch (club.owner.personality) {
      case 'YOUTH_INVESTOR': return 'YOUTH_DEVELOPMENT';
      case 'GALACTICO_OWNER': return 'WORLD_SUPERSTARS';
      case 'BUSINESS_OWNER': return 'SELLING_CLUB';
      case 'LOCAL_INVESTOR': return 'LOCAL_TALENT';
      case 'AGGRESSIVE_OWNER': return 'WINNING_NOW';
      case 'PATIENT_OWNER': return 'LONG_TERM_DEVELOPMENT';
      case 'FINANCIALLY_CONSERVATIVE': return 'FINANCIAL_STABILITY';
    }
  }
  return club.philosophy || 'BALANCED';
}

/**
 * Dynamic Club Overall Rating & Ownership Evolution.
 * Recalculates every club's rating and simulates natural owner changes/takeovers every season!
 * Unchanged from the original implementation — this evolves the RUNTIME game
 * state (which starts from, but is independent of, the static database).
 */
export function evolveWorldClubsAndOwners(
  clubs: Club[],
  currentYear: number
): { updatedClubs: Club[]; headlines: string[] } {
  const headlines: string[] = [];
  const ownerNamesPool = ["Arthur Pendelton", "Mikhail Volkov", "Chen Wei", "Marcus Sterling", "Sandro Rossi", "Tariq Al-Mansoor", "Lars Lindqvist", "Mateo Fernandez"];
  const personalities: OwnerPersonality[] = ['YOUTH_INVESTOR', 'GALACTICO_OWNER', 'BUSINESS_OWNER', 'LOCAL_INVESTOR', 'AGGRESSIVE_OWNER', 'PATIENT_OWNER', 'FINANCIALLY_CONSERVATIVE'];

  const updatedClubs = clubs.map(club => {
    let updatedOwner = club.owner ? { ...club.owner, age: club.owner.age + 1 } : undefined;
    let currentRating = club.rating;
    let currentFinances = club.finances || 70;

    // 1. DYNAMIC TAKEOVER / OWNER CHANGE CHECK (5% annual probability)
    const takeoverOccurred = Math.random() < 0.05 || (updatedOwner && updatedOwner.age >= 78 && Math.random() < 0.35);

    if (takeoverOccurred) {
      const newOwnerName = ownerNamesPool[Math.floor(Math.random() * ownerNamesPool.length)];
      const newPersonality = personalities[Math.floor(Math.random() * personalities.length)];
      const newSpendingPower = Math.floor(Math.random() * 5) + 5; // 5 - 10

      updatedOwner = {
        id: `owner_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: newOwnerName,
        personality: newPersonality,
        patience: Math.floor(Math.random() * 5) + 4,
        spendingPower: newSpendingPower,
        age: 42 + Math.floor(Math.random() * 25)
      };

      if (newPersonality === 'GALACTICO_OWNER' || newPersonality === 'AGGRESSIVE_OWNER') {
        currentFinances = Math.min(100, currentFinances + 18);
        headlines.push(`💰 MAJOR TAKEOVER: ${newOwnerName} buys ${club.name}! Injects massive transfer funds (${newPersonality}).`);
      } else if (newPersonality === 'FINANCIALLY_CONSERVATIVE') {
        currentFinances = Math.max(30, currentFinances - 15);
        headlines.push(`📉 FINANCIAL RESTRUCTURING: ${club.name} acquired by conservative ownership (${newOwnerName}). Budget cut.`);
      } else {
        headlines.push(`👔 CLUB TAKEOVER: ${club.name} sold to ${newOwnerName} under ${newPersonality.replace('_', ' ')} vision.`);
      }
    }

    // 2. DYNAMIC CLUB RATING EVOLUTION
    // Influenced by financial status, owner personality, and natural momentum
    let ratingDelta = 0;
    const spendingBonus = updatedOwner ? (updatedOwner.spendingPower - 5) * 0.4 : 0;
    const randomShift = (Math.random() * 3.2) - 1.6;

    ratingDelta = Math.round(spendingBonus + randomShift);

    // Bound ratings between tier standards (45 min, 96 max)
    let newRating = Math.max(45, Math.min(96, currentRating + ratingDelta));

    // Update Historical Peak and Trough
    const historicalPeak = Math.max(club.historicalPeak || currentRating, newRating);
    const historicalTrough = Math.min(club.historicalTrough || currentRating, newRating);

    // Major growth headline (e.g. Burnley rising to top tier OVR)
    if (newRating >= 85 && currentRating < 85) {
      headlines.push(`🚀 EUROPEAN POWERHOUSE: ${club.name} reaches elite status with a ${newRating} OVR club rating!`);
    } else if (currentRating >= 82 && newRating < 78) {
      headlines.push(`⚠️ CLUB DECLINE: ${club.name} falls out of European elite following disappointing campaigns (${newRating} OVR).`);
    }

    return {
      ...club,
      rating: newRating,
      finances: currentFinances,
      owner: updatedOwner,
      historicalPeak,
      historicalTrough
    };
  });

  return { updatedClubs, headlines };
}

/**
 * Multi-factor calculation of club interest in a player.
 */
function calculateClubInterestScore(club: Club, player: Player): number {
  const year = player.year;
  const philosophy = getEffectiveClubPhilosophy(club, year);
  const lastSeason = player.history.length > 0 ? player.history[player.history.length - 1] : null;

  let performanceBonus = 0;
  let isBreakoutStar = false;

  if (lastSeason) {
    const totalContrib = lastSeason.goals + lastSeason.assists;
    const avgRating = lastSeason.rating;

    if (totalContrib >= 25) performanceBonus += 35;
    else if (totalContrib >= 15) performanceBonus += 20;

    if (avgRating >= 8.0) performanceBonus += 40;
    else if (avgRating >= 7.4) performanceBonus += 25;

    if ((player.ovr <= 75 || player.age <= 21) && (totalContrib >= 18 || avgRating >= 7.6)) {
      isBreakoutStar = true;
      performanceBonus += 30;
    }
  }

  const effectivePlayerRating = isBreakoutStar ? Math.max(player.ovr, player.ovr + 12) : player.ovr;

  if (club.rating >= 84) {
    if (player.age <= 18 && player.ovr < 72 && !isBreakoutStar) return -999;
    if (effectivePlayerRating < 78 && !isBreakoutStar && player.intCaps < 10) return -500;
  }

  let ageScore = 0;
  if (player.age <= 20) {
    if (philosophy === 'YOUTH_DEVELOPMENT') ageScore += 45;
    else if (philosophy === 'MONEYBALL') ageScore += 35;
    else if (philosophy === 'WORLD_SUPERSTARS') ageScore -= 30;
  } else if (player.age >= 21 && player.age <= 27) {
    ageScore += 25;
    if (philosophy === 'WINNING_NOW' || philosophy === 'WORLD_SUPERSTARS') ageScore += 30;
  }

  const ratingGap = club.rating - effectivePlayerRating;
  let gapScore = 0;
  if (ratingGap >= -5 && ratingGap <= 8) gapScore += 50;
  else if (ratingGap > 8 && ratingGap <= 15) gapScore += 20;
  else if (ratingGap < -5 && ratingGap >= -15) gapScore += 25;

  return gapScore + performanceBonus + ageScore + (Math.random() * 10 - 5);
}

export function generateClubOffers(player: Player): TransferOffer[] {
  const isTransferListed = !!player.isTransferListed;
  const currentClub = getClubByName(player.club);
  const eligibleClubs = CLUBS_2026.filter(c => c.name.toLowerCase() !== player.club.toLowerCase());
  const usedClubIds = new Set<string>();

  const scoredClubs = eligibleClubs
    .map(c => ({ club: c, score: calculateClubInterestScore(c, player) }))
    .filter(item => item.score > -200)
    .sort((a, b) => b.score - a.score);

  const pickUnusedClub = (predicate: (c: Club) => boolean, defaultFallbackId: string): Club => {
    const match = scoredClubs.find(item => predicate(item.club) && !usedClubIds.has(item.club.id));
    if (match) {
      usedClubIds.add(match.club.id);
      return match.club;
    }
    const fallback = CLUBS_2026.find(c => c.id !== defaultFallbackId && c.name.toLowerCase() !== player.club.toLowerCase() && !usedClubIds.has(c.id))
      || CLUBS_2026.find(c => !usedClubIds.has(c.id))
      || currentClub;
    usedClubIds.add(fallback.id);
    return fallback;
  };

  const resultOffers: TransferOffer[] = [];

  // Check for Multi-Club Sister Transfer Option
  let sisterClubOption: Club | null = null;
  if (currentClub.multiClubGroupId) {
    const group = MULTI_CLUB_GROUPS.find(g => g.id === currentClub.multiClubGroupId);
    if (group) {
      const sisterIds = group.clubIds.filter(id => id !== currentClub.id);
      const candidates = CLUBS_2026.filter(c => sisterIds.includes(c.id));
      if (candidates.length > 0) {
        sisterClubOption = candidates[Math.floor(Math.random() * candidates.length)];
        usedClubIds.add(sisterClubOption.id);
      }
    }
  }

  if (!isTransferListed) {
    resultOffers.push({
      id: "stay",
      club: currentClub,
      type: 'STAY',
      label: "RE-SIGN AT CURRENT CLUB",
      tagClass: "tag-perfect",
      contractLength: 1,
      description: `Stay at ${currentClub.name} and lead the team for another campaign.`
    });

    if (sisterClubOption) {
      resultOffers.push({
        id: "sister_club",
        club: sisterClubOption,
        type: 'SISTER_CLUB',
        label: "MOVE TO SISTER CLUB",
        tagClass: "tag-too-good",
        contractLength: 1,
        description: `Direct internal transfer within ownership group to ${sisterClubOption.name} (${sisterClubOption.rating} OVR).`
      });
    }

    const stepUpClub = (player.unsettledSeasonsRemaining ?? 0) > 0
      // Circling smaller clubs while unsettled — no genuine big-prestige
      // interest is coming in right now, only a modest step up at best.
      ? pickUnusedClub(c => c.rating > player.ovr && c.rating <= player.ovr + 6, "RMA")
      : pickUnusedClub(c => c.rating > player.ovr, "RMA");
    resultOffers.push({
      id: "too_good",
      club: stepUpClub,
      type: 'TOO_GOOD',
      label: (player.unsettledSeasonsRemaining ?? 0) > 0 ? "MODEST STEP UP" : "HIGH PRESTIGE MOVE",
      tagClass: "tag-too-good",
      contractLength: 1,
      description: (player.unsettledSeasonsRemaining ?? 0) > 0
        ? `A steady move to ${stepUpClub.name} (${stepUpClub.rating} OVR) — not a big name, but a chance to rebuild some consistency.`
        : `High prestige move to ${stepUpClub.name} (${stepUpClub.rating} OVR) to compete at the highest level.`
    });

    const perfectClub = pickUnusedClub(c => Math.abs(c.rating - player.ovr) <= 5, "CTC");
    resultOffers.push({
      id: "perfect",
      club: perfectClub,
      type: 'PERFECT',
      label: "PERFECT MATCH",
      tagClass: "tag-perfect",
      contractLength: 1,
      description: `Ideal squad fit at ${perfectClub.name} (${perfectClub.rating} OVR) with starting guarantees.`
    });

    const lowerClub = pickUnusedClub(c => c.rating < player.ovr, "SHA");
    resultOffers.push({
      id: "lower",
      club: lowerClub,
      type: 'LOWER_TIER',
      label: "STAR ROLE MOVE",
      tagClass: "tag-not-good",
      contractLength: 1,
      description: `Offering starring role and leadership responsibilities at ${lowerClub.name}.`
    });

    if (!sisterClubOption) {
      const loanClub = pickUnusedClub(c => true, "anderlecht");
      resultOffers.push({
        id: "loan",
        club: loanClub,
        type: 'LOAN',
        label: "SEASON LOAN",
        tagClass: "tag-loan",
        contractLength: 1,
        description: `1-Year temporary loan deal to gain crucial top-flight experience at ${loanClub.name}.`
      });
    }

  } else {
    // TRANSFER LISTED WINDOW (6 OFFERS, NO STAY)
    if (sisterClubOption) {
      resultOffers.push({
        id: "forced_sister",
        club: sisterClubOption,
        type: 'SISTER_CLUB',
        label: "SISTER CLUB REFUGE",
        tagClass: "tag-too-good",
        contractLength: 1,
        description: `Internal network transfer to sister club ${sisterClubOption.name} (${sisterClubOption.rating} OVR).`
      });
    }

    const stepUpClub = pickUnusedClub(c => c.rating >= player.ovr, "RMA");
    resultOffers.push({
      id: "forced_1",
      club: stepUpClub,
      type: 'FORCED_TRANSFER',
      label: "PRESTIGE EXIT BID",
      tagClass: "tag-too-good",
      contractLength: 1,
      description: `Capitalizing on transfer listing, ${stepUpClub.name} submitted a major bid.`
    });

    const perfectClubA = pickUnusedClub(c => Math.abs(c.rating - player.ovr) <= 5, "CTC");
    resultOffers.push({
      id: "forced_2",
      club: perfectClubA,
      type: 'PERFECT',
      label: "PRIMARY PERFECT MATCH",
      tagClass: "tag-perfect",
      contractLength: 1,
      description: `Immediate starting opportunity following transfer listing at ${perfectClubA.name}.`
    });

    const perfectClubB = pickUnusedClub(c => Math.abs(c.rating - player.ovr) <= 6, "RSO");
    resultOffers.push({
      id: "forced_3",
      club: perfectClubB,
      type: 'PERFECT',
      label: "ALTERNATIVE MATCH",
      tagClass: "tag-perfect",
      contractLength: 1,
      description: `Tactical fit offering key first-team responsibilities at ${perfectClubB.name}.`
    });

    const fallbackClubA = pickUnusedClub(c => c.rating <= player.ovr && c.rating >= player.ovr - 5, "SOU");
    resultOffers.push({
      id: "forced_4",
      club: fallbackClubA,
      type: 'LOWER_TIER',
      label: "REALISTIC FALLBACK MOVE",
      tagClass: "tag-not-good",
      contractLength: 1,
      description: `Guaranteed starting spot and immediate squad exit at ${fallbackClubA.name}.`
    });

    if (!sisterClubOption) {
      const fallbackClubB = pickUnusedClub(c => c.rating <= player.ovr && c.rating >= player.ovr - 7, "COV");
      resultOffers.push({
        id: "forced_5",
        club: fallbackClubB,
        type: 'LOWER_TIER',
        label: "SECOND REALISTIC FALLBACK",
        tagClass: "tag-not-good",
        contractLength: 1,
        description: `Offering fresh start and captaincy role at ${fallbackClubB.name}.`
      });
    }
  }

  return resultOffers;
}
