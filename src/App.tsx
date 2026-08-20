import React, { useState, useEffect } from 'react';
import {
  Player,
  Ancestor,
  TimelineEntry,
  WorldHeadlinePackage,
  League,
  SeasonRecord,
  TransferOffer,
  RandomEvent,
  SaveSlot,
  Superstar,
  QuickFireSummaryData
} from './types';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { CareerTab } from './components/CareerTab';
import { LegacyTab } from './components/LegacyTab';
import { WorldTab } from './components/WorldTab';
import { MoreTab } from './components/MoreTab';

import { CreationModal } from './components/CreationModal';
import { RandomEventModal } from './components/RandomEventModal';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { AwardsModal } from './components/AwardsModal';
import { TransferModal } from './components/TransferModal';
import { RetirementModal } from './components/RetirementModal';
import { QuickFireSummaryModal } from './components/QuickFireSummaryModal';
import { MainMenuModal } from './components/MainMenuModal';
import { LegendComparisonModal } from './components/LegendComparisonModal';

import { runFullQuickFireCareer, rollSeasonTrophies, computeSquadFitMultiplier, rollAgeRandomComponent, resolveLoanSpell, rollCareerCeiling, checkLoyaltyMilestone, rollDepartureRisk } from './utils/quickfireEngine';

import { getClubByName, generateClubOffers, LEAGUES_2026, ACTIVE_DATABASE_ID, ACTIVE_DATABASE_VERSION } from './data/database2026';
import { triggerRandomEvent, checkWonderkidCrossroads } from './data/events';
import { simulateInternationalDuty, IntSimResult } from './data/international';
import {
  timelineFeed,
  setTimelineFeed,
  addTimelineEntry,
  checkSeasonMilestones
} from './data/timeline';
import {
  calculateBallonDor,
  calculateGoldenShoe,
  getMediaVerdict,
  getMediaPotentialStatus,
  BallonDorResult,
  MediaVerdict,
  INITIAL_SUPERSTARS,
  advanceSuperstars
} from './data/awards';
import {
  globalNewsFeed,
  dynamicLeagues,
  dynamicClubs,
  setWorldFeed,
  generateSeasonHeadlines
} from './data/world';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Master State
  const [player, setPlayer] = useState<Player | null>(null);
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [legacyScore, setLegacyScore] = useState<number>(0);
  const [currentGen, setCurrentGen] = useState<number>(1);
  const [localTimeline, setLocalTimeline] = useState<TimelineEntry[]>([]);
  const [newsFeed, setNewsFeed] = useState<WorldHeadlinePackage[]>([]);
  const [leagues, setLeagues] = useState<League[]>(LEAGUES_2026);
  const [superstars, setSuperstars] = useState<Superstar[]>(INITIAL_SUPERSTARS);

  // Modals Flow
  const [showMainMenuModal, setShowMainMenuModal] = useState<boolean>(false);
  const [showCreationModal, setShowCreationModal] = useState<boolean>(false);
  const [showLegendComparison, setShowLegendComparison] = useState<boolean>(false);
  const [activeRandomEvent, setActiveRandomEvent] = useState<RandomEvent | null>(null);
  const [pendingSeasonData, setPendingSeasonData] = useState<{
    seasonRecord: SeasonRecord;
    ballonDor: BallonDorResult;
    mediaVerdict: MediaVerdict;
    goldenShoeWon: boolean;
    intResult: IntSimResult;
    retirementHeadlines?: string[];
    updatedSuperstars?: Superstar[];
  } | null>(null);

  const [showSeasonSummary, setShowSeasonSummary] = useState<boolean>(false);
  const [showAwardsModal, setShowAwardsModal] = useState<boolean>(false);
  const [activeTransferOffers, setActiveTransferOffers] = useState<TransferOffer[] | null>(null);
  const [showRetirementModal, setShowRetirementModal] = useState<boolean>(false);
  const [quickFireSummary, setQuickFireSummary] = useState<QuickFireSummaryData | null>(null);
  const [showQuickFireSummaryModal, setShowQuickFireSummaryModal] = useState<boolean>(false);

  // Load Auto-Save or Trigger Character Creation
  useEffect(() => {
    const rawAuto = localStorage.getItem('football_legacy_autosave');
    if (rawAuto) {
      try {
        const parsed: SaveSlot = JSON.parse(rawAuto);
        if (parsed.player) {
          if (parsed.databaseId && parsed.databaseId !== ACTIVE_DATABASE_ID) {
            console.warn(`[save] This save was created against database "${parsed.databaseId}" but the active database is "${ACTIVE_DATABASE_ID}". Loading anyway — club/league references may not fully match until the matching database DLC is installed.`);
          }
          setPlayer(parsed.player);
          setAncestors(parsed.legacyTree || []);
          setLegacyScore(parsed.legacyScore || 0);
          setCurrentGen(parsed.currentGeneration || 1);
          setLocalTimeline(parsed.timeline || []);
          setTimelineFeed(parsed.timeline || []);
          setNewsFeed(parsed.newsFeed || []);
          if (parsed.dynamicLeagues) {
            setLeagues(parsed.dynamicLeagues);
          }
          if (parsed.worldSuperstars && parsed.worldSuperstars.length > 0) {
            setSuperstars(parsed.worldSuperstars);
          } else {
            setSuperstars(INITIAL_SUPERSTARS);
          }
          setWorldFeed(parsed.newsFeed || [], parsed.dynamicLeagues || LEAGUES_2026, parsed.dynamicClubs);
          return;
        }
      } catch {
        // Fallback to fresh setup
      }
    }
    setShowMainMenuModal(true);
  }, []);

  // Handle Legend Career Selection
  const handleSelectLegendCareer = (legendPlayer: Player) => {
    setPlayer(legendPlayer);
    setShowMainMenuModal(false);
    setShowCreationModal(false);
    addTimelineEntry(
      legendPlayer,
      'MILESTONE',
      'Legend Career Kickoff',
      `Stepped into the boots of ${legendPlayer.name}, starting professional journey at ${legendPlayer.club} in ${legendPlayer.year}.`
    );
    setLocalTimeline([...timelineFeed]);
    saveToAutoSave(legendPlayer, 0, []);
  };

  // Auto-save helper
  const saveToAutoSave = (updatedPlayer: Player, updatedScore: number, updatedAncestors: Ancestor[], currentSuperstars?: Superstar[]) => {
    const autoObj: SaveSlot = {
      id: 0,
      saveName: `${updatedPlayer.name} (Auto-Save)`,
      dateSaved: new Date().toLocaleDateString(),
      player: updatedPlayer,
      legacyTree: updatedAncestors,
      legacyScore: updatedScore,
      currentGeneration: updatedPlayer.generation,
      timeline: timelineFeed,
      newsFeed: globalNewsFeed,
      dynamicLeagues: leagues,
      worldSuperstars: currentSuperstars || superstars,
      dynamicClubs: dynamicClubs,
      databaseId: ACTIVE_DATABASE_ID,
      databaseVersion: ACTIVE_DATABASE_VERSION,
      installedDLC: [],
      gameVersion: '0.3.0',
    };
    localStorage.setItem('football_legacy_autosave', JSON.stringify(autoObj));
  };

  // 1. Creation Handler
  const handlePlayerCreated = (newPlayer: Player) => {
    setPlayer(newPlayer);
    setShowCreationModal(false);

    // Initial timeline entry
    addTimelineEntry(
      newPlayer,
      'MILESTONE',
      'Career Kickoff',
      `Signed first professional contract with ${newPlayer.club} at 18 years old.`
    );

    setLocalTimeline([...timelineFeed]);
    saveToAutoSave(newPlayer, legacyScore, ancestors);
  };

// Dynamic OVR Progression Calculator (Age bounds, performance, league quality vs player rating)
function calculateDynamicOvrChange(
  player: Player,
  clubRating: number,
  apps: number,
  goals: number,
  assists: number,
  rating: number
): number {
  // 1. Age-banded random component — shared with Quick-Fire mode via
  // rollAgeRandomComponent(), so a player of a given age gets the same
  // underlying variance in both game modes. This also replaces the old
  // flat "random noise" term below, since the age roll already supplies
  // realistic random variance (wider for young players, narrower/more
  // negative-skewed for veterans).
  const randomComponent = rollAgeRandomComponent(player.age);

  // 2. Performance Factor (-3 to +4)
  let perfBonus = 0;
  if (rating >= 7.8) perfBonus += 3;
  else if (rating >= 7.4) perfBonus += 2;
  else if (rating >= 7.1) perfBonus += 1;
  else if (rating < 6.8) perfBonus -= 2;

  // Goals / Assists bonus
  const isAttacker = player.position === 'ST' || player.position === 'LW' || player.position === 'RW' || player.position === 'CAM';
  if (isAttacker && goals >= 25) perfBonus += 2;
  else if (isAttacker && goals >= 15) perfBonus += 1;
  if (assists >= 12) perfBonus += 1;

  // 3. League Quality vs Player OVR Factor
  // clubRating represents the competition standard
  let leagueQualityDelta = 0;
  const ovrGap = clubRating - player.ovr;

  if (ovrGap >= 15 && rating >= 7.2) {
    // Player is far lower rated than competition but playing well -> Massive Growth!
    leagueQualityDelta += 3;
  } else if (ovrGap >= 8) {
    leagueQualityDelta += 1;
  } else if (ovrGap <= -25) {
    // Player is 25+ OVR higher than competition (e.g. 95 OVR in a 55 OVR league)
    leagueQualityDelta -= 5;
  } else if (ovrGap <= -15) {
    // Player is 15+ OVR higher than competition -> Competition too low to maintain elite standard
    leagueQualityDelta -= 3;
  } else if (ovrGap <= -8) {
    leagueQualityDelta -= 1;
  }

  // 4. Hidden Career Ceiling Taper — the actual "destined for it or not"
  // mechanic. Rolled once at creation (rollCareerCeiling(), same
  // distribution Quick-Fire uses — ~80% of careers cap at "solid pro" or
  // below) and never revealed. This has to be multiplicative, not another
  // flat additive penalty: an additive penalty can simply be outmuscled
  // by stacking the league-quality/performance/age bonuses above (which
  // is exactly how a big-club start alone used to buy its way to world
  // class regardless of ceiling). Scaling down whatever positive growth
  // is left, the closer to (or past) the ceiling you are, makes it a real
  // wall instead of a headwind. Decline is never dampened — falling off
  // hits at full strength no matter the ceiling.
  const ceiling = player.careerCeiling ?? 80;
  const distanceToCeiling = ceiling - player.ovr; // + = genuine room left, - = already past it

  // 5. Playing Time
  let timeFactor = 0;
  if (apps < 20) timeFactor = -2;
  else if (apps < 28) timeFactor = -1;

  // 6. Traits Bonus
  let traitBonus = 0;
  if (player.traits.some(t => t.id === 'dynasty_blood')) {
    traitBonus += 1;
  }

  // 7. Unsettled Penalty — the real downside of a departure risk roll
  // gone badly (see rollDepartureRisk). Growth is further dampened while
  // this is active, on top of everything else, representing genuinely
  // struggling to find your feet at a new club.
  const unsettledPenalty = (player.unsettledSeasonsRemaining ?? 0) > 0 ? -2 : 0;

  // Total: age-band random roll (replaces old per-age hard clamp + flat
  // noise term) plus this mode's circumstance/performance factors, which
  // Quick-Fire doesn't need in the same form since its own AI-driven
  // transfer logic (squad-fit multiplier, consecutive-poor-fit listing)
  // already accounts for league/club mismatch elsewhere.
  let calculatedDelta = randomComponent + perfBonus + leagueQualityDelta + timeFactor + traitBonus + unsettledPenalty;

  if (calculatedDelta > 0) {
    let growthMultiplier = 1;
    if (distanceToCeiling <= -8) growthMultiplier = 0;      // hard wall — no further growth possible
    else if (distanceToCeiling <= -4) growthMultiplier = 0.1;
    else if (distanceToCeiling <= -1) growthMultiplier = 0.15;
    else if (distanceToCeiling <= 2) growthMultiplier = 0.3;
    else if (distanceToCeiling <= 5) growthMultiplier = 0.55;
    calculatedDelta *= growthMultiplier;
  }

  // Safety bound only — the age-band roll already supplies age-appropriate
  // variance, so this just prevents an extreme stack of every circumstance
  // factor landing the same season from producing an absurd single-season
  // swing. Global OVR is clamped separately to [48, 99] where this is used.
  calculatedDelta = Math.max(-12, Math.min(12, calculatedDelta));

  return calculatedDelta;
}

  // 2. Sim Season Controller
  const handleSimSeason = () => {
    if (!player) return;

    // Backward-compat lazy init: saves created before the career-ceiling
    // system existed won't have this rolled yet. Roll it once here so it
    // persists from this point on, same fallback pattern Quick-Fire uses.
    if (player.careerCeiling === undefined) {
      player.careerCeiling = rollCareerCeiling();
    }

    if (player.gameMode === 'QUICK_FIRE') {
      sound.playSimStart();
      const result = runFullQuickFireCareer(player, superstars, [], leagues);
      setPlayer(result.finalPlayer);
      setSuperstars(result.superstars);
      setLocalTimeline(result.timeline);
      setTimelineFeed(result.timeline);
      setWorldFeed(result.newsFeed, leagues);
      setNewsFeed(result.newsFeed);
      setQuickFireSummary(result.summary);
      setShowQuickFireSummaryModal(true);
      const newScore = legacyScore + result.summary.legacyScore;
      setLegacyScore(newScore);
      saveToAutoSave(result.finalPlayer, newScore, ancestors, result.superstars);
      return;
    }

    const club = getClubByName(player.club);
    const fitMultiplier = computeSquadFitMultiplier(player.ovr, club.rating);

    // Calculate match stats
    const apps = Math.round((Math.floor(Math.random() * 10) + 28) * fitMultiplier); // 28 to 38 apps, scaled by squad fit

    let posGoalFactor = 0.1;
    if (player.position === 'ST') posGoalFactor = 0.65;
    else if (player.position === 'CAM' || player.position === 'LW' || player.position === 'RW') posGoalFactor = 0.42;
    else if (player.position === 'CM' || player.position === 'LM' || player.position === 'RM') posGoalFactor = 0.22;
    else if (player.position === 'CB' || player.position === 'LB' || player.position === 'RB') posGoalFactor = 0.08;
    else if (player.position === 'GK') posGoalFactor = 0.0;

    const goals = player.position === 'GK' ? 0 : Math.round(apps * posGoalFactor * (player.ovr / 72) * (Math.random() * 0.7 + 0.65) * fitMultiplier);
    const assists = player.position === 'GK' ? 0 : Math.round(apps * 0.22 * (player.ovr / 75) * (Math.random() * 0.8 + 0.5) * fitMultiplier);
    const rating = Math.round((7.0 + (goals * 0.08) + (assists * 0.05) + (player.ovr * 0.01) + (Math.random() * 0.4 - 0.2)) * 100) / 100;

    // Calculate Dynamic OVR Delta
    const baseDelta = calculateDynamicOvrChange(player, club.rating, apps, goals, assists, rating);

    // Check for Club Trophies — rolled per-competition, independently, so
    // more than one is genuinely possible (a treble is rare but real),
    // and a top-rated club can win the league itself, not only continental
    // competitions.
    const trophiesWon = rollSeasonTrophies(club.rating);

    // International Duty
    const intResult = simulateInternationalDuty(player);

    // Create Base Season Record
    const oldOvr = player.ovr;
    const newOvr = Math.max(48, Math.min(99, oldOvr + baseDelta));
    const ovrChange = newOvr - oldOvr;

    const seasonRecord: SeasonRecord = {
      year: player.year,
      age: player.age,
      club: player.club,
      leagueName: club.leagueId,
      apps,
      goals,
      assists,
      rating,
      oldOvr,
      newOvr,
      ovrChange,
      trophiesWon,
      awardsWon: []
    };

    // Advance AI Superstars (Aging, Decline, Retirement & Regens)
    const { updatedSuperstars, retirementHeadlines } = advanceSuperstars(superstars, player.year);
    setSuperstars(updatedSuperstars);

    // Calculate Ballon d'Or & Golden Shoe using updated active superstars
    const ballonDor = calculateBallonDor(player, {
      goals,
      assists,
      avgRating: rating,
      trophyWon: trophiesWon.length > 0,
      intTrophyWon: intResult.trophyWon !== null,
      apps
    }, updatedSuperstars);

    const goldenShoeWon = calculateGoldenShoe(player, goals);
    const mediaVerdict = getMediaVerdict({ ...player, ovr: newOvr }, {
      apps,
      goals,
      assists,
      avgRating: rating,
      ovrGrowth: ovrChange
    });

    // Store Pending Simulation Data
    setPendingSeasonData({
      seasonRecord,
      ballonDor,
      mediaVerdict,
      goldenShoeWon,
      intResult,
      retirementHeadlines,
      updatedSuperstars
    });

    // Check for Random Event Trigger — the wonderkid crossroads takes
    // priority over the normal weighted pool so it reliably fires at the
    // right moment rather than getting buried under everything else.
    const crossroadsEvent = checkWonderkidCrossroads(player, club.rating);
    const event = crossroadsEvent || triggerRandomEvent(player);
    if (event) {
      setActiveRandomEvent(event);
    } else {
      finalizeSeasonData(seasonRecord, ballonDor, goldenShoeWon, intResult);
    }
  };

  // 3. Resolve Random Event and Proceed
  const handleRandomEventResolved = (result: { ovrDelta: number; legacyBonus: number; text: string; forceHigherOffers?: boolean }) => {
    if (!player || !pendingSeasonData) return;

    setActiveRandomEvent(null);

    // Apply event modifiers
    const updatedRecord = { ...pendingSeasonData.seasonRecord };
    updatedRecord.newOvr = Math.max(48, Math.min(99, updatedRecord.newOvr + result.ovrDelta));
    updatedRecord.ovrChange = updatedRecord.newOvr - updatedRecord.oldOvr;

    if (result.forceHigherOffers) {
      player.isTransferListed = true;
    }

    addTimelineEntry(
      player,
      result.ovrDelta >= 0 ? 'MILESTONE' : 'INJURY',
      'Season Event Outcome',
      result.text
    );

    setLegacyScore(prev => prev + result.legacyBonus);

    finalizeSeasonData(
      updatedRecord,
      pendingSeasonData.ballonDor,
      pendingSeasonData.goldenShoeWon,
      pendingSeasonData.intResult
    );
  };

  // 4. Finalize Season Logging & Legacy Calculations
  const finalizeSeasonData = (
    sRecord: SeasonRecord,
    bDor: BallonDorResult,
    gShoe: boolean,
    intRes: IntSimResult
  ) => {
    if (!player) return;

    // Mutate Player State for Season Stats
    const updatedPlayer: Player = { ...player };
    updatedPlayer.ovr = sRecord.newOvr;
    updatedPlayer.totalApps += sRecord.apps;
    updatedPlayer.totalGoals += sRecord.goals;
    updatedPlayer.totalAssists += sRecord.assists;
    updatedPlayer.avgRatingSum += sRecord.rating;
    updatedPlayer.totalTrophies += sRecord.trophiesWon.length;

    // Wind down an active "unsettled" spell one season at a time.
    if ((updatedPlayer.unsettledSeasonsRemaining ?? 0) > 0) {
      updatedPlayer.unsettledSeasonsRemaining = (updatedPlayer.unsettledSeasonsRemaining ?? 0) - 1;
    }

    if (bDor.isUserWinner) {
      updatedPlayer.ballonDorsWon += 1;
      updatedPlayer.ballonDorStreak = (player.ballonDorStreak ?? 0) + 1;
      sRecord.awardsWon.push("Ballon d'Or");
      addTimelineEntry(updatedPlayer, 'AWARD', "BALLON D'OR WINNER!", "Crown world player of the year!");
    } else {
      updatedPlayer.ballonDorStreak = 0;
    }

    if (gShoe) {
      updatedPlayer.goldenShoesWon += 1;
      sRecord.awardsWon.push("European Golden Shoe");
    }

    // International Duty Stats
    if (intRes.calledUp) {
      updatedPlayer.intCaps += intRes.caps;
      updatedPlayer.intGoals += intRes.goals;
      updatedPlayer.intAssists += intRes.assists;
      if (intRes.isCaptain) updatedPlayer.isCaptain = true;
      if (intRes.trophyWon) {
        if (!updatedPlayer.intTrophies) updatedPlayer.intTrophies = [];
        updatedPlayer.intTrophies.push(intRes.trophyWon);
      }
    }

    // Milestones check
    checkSeasonMilestones(updatedPlayer, sRecord.apps, sRecord.goals, intRes);

    // History log
    updatedPlayer.history.push(sRecord);

    // Legacy Score calculation
    const seasonPts =
      sRecord.goals * 100 +
      sRecord.assists * 50 +
      (sRecord.trophiesWon.length * 1500) +
      (bDor.isUserWinner ? 5000 : 0) +
      (gShoe ? 1000 : 0) +
      (intRes.trophyWon ? 2000 : 0);

    const newLegacyScore = legacyScore + seasonPts;
    setLegacyScore(newLegacyScore);

    // World Headlines
    generateSeasonHeadlines(
      updatedPlayer,
      {
        goals: sRecord.goals,
        apps: sRecord.apps,
        trophiesWon: sRecord.trophiesWon
      },
      bDor,
      intRes,
      pendingSeasonData?.retirementHeadlines || []
    );

    setNewsFeed([...globalNewsFeed]);
    setLocalTimeline([...timelineFeed]);
    setPlayer(updatedPlayer);

    saveToAutoSave(updatedPlayer, newLegacyScore, ancestors, pendingSeasonData?.updatedSuperstars || superstars);

    // Open Season Summary Modal
    setShowSeasonSummary(true);
  };

  // 5. Proceed from Season Summary -> Awards Modal
  const handleProceedToAwards = () => {
    setShowSeasonSummary(false);
    setShowAwardsModal(true);
  };

  // 6. Proceed from Awards Modal -> Transfer Offers
  const handleProceedToTransfers = () => {
    if (!player) return;
    setShowAwardsModal(false);

    let currentPlayer = player;

    // Resolve a just-completed loan spell before offers are generated, so
    // a "STAY" offer (if any) refers to the right club — either the loan
    // club (if it exercises its option to keep the player) or the parent
    // club the player returns to.
    if (currentPlayer.loanParentClub) {
      const loanClub = getClubByName(currentPlayer.club);
      const resolution = resolveLoanSpell(currentPlayer, loanClub);
      const wasLoanClub = currentPlayer.club;

      addTimelineEntry(
        currentPlayer,
        'TRANSFER',
        resolution.keptPermanently ? `Loan Made Permanent — Signed for ${wasLoanClub}` : `Loan Spell Ended — Returned to ${resolution.club}`,
        resolution.keptPermanently
          ? `Impressed enough on loan that ${wasLoanClub} triggered the option to make the move permanent.`
          : `The season-long loan at ${wasLoanClub} concluded, and the move back to ${resolution.club} followed as agreed.`
      );

      currentPlayer = {
        ...currentPlayer,
        club: resolution.club,
        clubColor: resolution.clubColor,
        clubSecondaryColor: resolution.clubSecondaryColor,
        // Made permanent = a new home, tenure starts over there. Returned
        // to the parent club = tenure was only ever paused, not reset.
        currentClubTenure: resolution.keptPermanently ? 0 : currentPlayer.currentClubTenure,
        loanParentClub: undefined,
        loanParentClubColor: undefined,
        loanParentClubSecondaryColor: undefined,
      };
      setPlayer(currentPlayer);
      setLocalTimeline([...timelineFeed]);
    }

    const offers = generateClubOffers(currentPlayer);
    setActiveTransferOffers(offers);
  };

  // 7. Complete Transfer Option Selection
  const handleOfferSelected = (offer: TransferOffer) => {
    if (!player) return;

    let updatedClubName = player.club;
    let updatedColor = player.clubColor;
    let updatedSecondaryColor = player.clubSecondaryColor;
    let nextTenure = player.currentClubTenure ?? 0;
    let nextUnsettled = player.unsettledSeasonsRemaining ?? 0;
    let legacyDelta = 0;

    if (offer.type === 'STAY') {
      nextTenure += 1;
      const milestone = checkLoyaltyMilestone(nextTenure);
      legacyDelta += milestone.legacyBonus;
      addTimelineEntry(
        player,
        'MILESTONE',
        `Contract Extension`,
        milestone.narrative || `Re-signed with ${player.club} for another season.`
      );
    } else if (offer.type === 'LOAN') {
      // Still contracted to the parent club — tenure there is paused, not
      // reset, while the loan plays out.
      updatedClubName = offer.club.name;
      updatedColor = offer.club.color;
      updatedSecondaryColor = offer.club.secondaryColor || '#1E1E1E';
      addTimelineEntry(
        player,
        'TRANSFER',
        `Loan Move to ${offer.club.name}`,
        `Season-long loan move to ${offer.club.name}. ${offer.description}`
      );
    } else {
      // A real, permanent departure — this is the risky move. Leaving a
      // club you'd settled at for years is a genuine gamble: it can pay
      // off spectacularly, or leave you unsettled for seasons, circling
      // smaller clubs while your reputation quietly erodes.
      const priorTenure = player.currentClubTenure ?? 0;
      const risk = rollDepartureRisk(priorTenure, offer.club.rating, player.ovr);
      updatedClubName = offer.club.name;
      updatedColor = offer.club.color;
      updatedSecondaryColor = offer.club.secondaryColor || '#1E1E1E';
      nextTenure = 0;

      if (priorTenure >= 3) {
        legacyDelta -= risk.legacyPenalty;
      }
      if (risk.unsettled) {
        nextUnsettled = risk.unsettledSeasons;
      }

      const departureNarrative = priorTenure >= 3
        ? (risk.unsettled
            ? `Walking away from ${player.club} after ${priorTenure} years stung the fans badly, and the move to ${offer.club.name} hasn't gone to plan — it may take a few seasons to find your feet again.`
            : `Leaving ${player.club} after ${priorTenure} years divided the fanbase, but the fresh start at ${offer.club.name} is already paying off.`)
        : `Completed contract move to ${offer.club.name} (${offer.label}).`;

      addTimelineEntry(
        player,
        'TRANSFER',
        `Transfer to ${offer.club.name}`,
        departureNarrative
      );
    }

    const nextPlayer: Player = {
      ...player,
      age: player.age + 1,
      year: player.year + 1,
      club: updatedClubName,
      clubColor: updatedColor,
      clubSecondaryColor: updatedSecondaryColor,
      isTransferListed: false,
      currentClubTenure: nextTenure,
      unsettledSeasonsRemaining: nextUnsettled,
      // A LOAN offer sends the player out for exactly one season — track
      // where they came from so resolveLoanSpell() can send them back (or
      // make it permanent) once that season is played.
      loanParentClub: offer.type === 'LOAN' ? player.club : undefined,
      loanParentClubColor: offer.type === 'LOAN' ? player.clubColor : undefined,
      loanParentClubSecondaryColor: offer.type === 'LOAN' ? player.clubSecondaryColor : undefined,
    };

    setPlayer(nextPlayer);
    setActiveTransferOffers(null);
    setLocalTimeline([...timelineFeed]);
    if (legacyDelta !== 0) {
      setLegacyScore(prev => Math.max(0, prev + legacyDelta));
    }

    saveToAutoSave(nextPlayer, legacyScore + legacyDelta, ancestors);

    // Check forced retirement rule
    if (nextPlayer.age >= 46 || (nextPlayer.age >= 33 && nextPlayer.ovr < 66)) {
      if (nextPlayer.isLegendMode || nextPlayer.gameMode === 'LEGEND') {
        setShowLegendComparison(true);
      } else {
        setShowRetirementModal(true);
      }
    }
  };

  // 8. Handle Return to Main Menu
  const handleReturnToMainMenu = () => {
    if (player) {
      saveToAutoSave(player, legacyScore, ancestors);
    }
    setShowQuickFireSummaryModal(false);
    setShowSeasonSummary(false);
    setShowAwardsModal(false);
    setActiveTransferOffers(null);
    setShowRetirementModal(false);
    setShowLegendComparison(false);
    setShowCreationModal(false);
    setPlayer(null);
    setShowMainMenuModal(true);
  };

  // 9. Handle Quick Fire Continue As Child
  const handleQuickFireContinueAsChild = () => {
    if (!player) return;

    const peak = Math.max(player.ovr, ...player.history.map(h => h.ovrAfterSeason || h.newOvr || player.ovr));
    const startYr = player.history.length > 0 ? player.history[0].year : player.year;

    const newAncestor: Ancestor = {
      generation: player.generation,
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      startYear: startYr,
      retireYear: player.year,
      peakOvr: peak,
      finalClub: player.club,
      totalApps: player.totalApps,
      totalGoals: player.totalGoals,
      totalAssists: player.totalAssists,
      totalTrophies: player.totalTrophies,
      ballonDorsWon: player.ballonDorsWon,
      intCaps: player.intCaps,
      intGoals: player.intGoals || 0,
      inheritedTraits: [],
      hallOfFame: player.ovr >= 85 || player.ballonDorsWon >= 1
    };

    const updatedAncestors = [...ancestors, newAncestor];
    setAncestors(updatedAncestors);
    setCurrentGen(prev => prev + 1);
    setShowQuickFireSummaryModal(false);
    setShowCreationModal(true);
  };

  // Handle Instant Sim Career
  const handleSimCareer = () => {
    if (!player) return;
    sound.playSimStart();
    const result = runFullQuickFireCareer(player, superstars, [], leagues);
    setPlayer(result.finalPlayer);
    setSuperstars(result.superstars);
    setLocalTimeline(result.timeline);
    setTimelineFeed(result.timeline);
    setQuickFireSummary(result.summary);
    setShowQuickFireSummaryModal(true);

    const newScore = (result.finalPlayer.totalGoals * 5) +
      (result.finalPlayer.totalAssists * 3) +
      (result.finalPlayer.totalTrophies * 50) +
      (result.finalPlayer.ballonDorsWon * 200) +
      (result.finalPlayer.intCaps * 2) +
      (result.summary.peakOvr * 10);

    setLegacyScore(newScore);
    saveToAutoSave(result.finalPlayer, newScore, ancestors, result.superstars);
  };

  // 10. Handle Retirement & Child Generation
  const handleRetireClick = () => {
    sound.playTap();
    if (player?.isLegendMode || player?.gameMode === 'LEGEND') {
      setShowLegendComparison(true);
    } else {
      setShowRetirementModal(true);
    }
  };

  const handleProceedToChildCreation = () => {
    if (!player) return;

    // Archive ancestor
    const peakOvr = Math.max(...player.history.map(h => h.newOvr), player.ovr);
    const isHOF = peakOvr >= 85 || player.ballonDorsWon >= 1;

    const ancestorNode: Ancestor = {
      generation: player.generation,
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      startYear: player.year - (player.age - 18),
      retireYear: player.year,
      peakOvr,
      finalClub: player.club,
      totalApps: player.totalApps,
      totalGoals: player.totalGoals,
      totalAssists: player.totalAssists,
      totalTrophies: player.totalTrophies,
      ballonDorsWon: player.ballonDorsWon,
      intCaps: player.intCaps,
      intGoals: player.intGoals,
      inheritedTraits: player.traits || [],
      hallOfFame: isHOF
    };

    const updatedAncestors = [...ancestors, ancestorNode];
    setAncestors(updatedAncestors);
    setCurrentGen(prev => prev + 1);

    setShowRetirementModal(false);
    setShowCreationModal(true);
  };

  // 9. Reset Dynasty
  const handleResetData = () => {
    localStorage.removeItem('football_legacy_autosave');
    setPlayer(null);
    setAncestors([]);
    setLegacyScore(0);
    setCurrentGen(1);
    setTimelineFeed([]);
    setLocalTimeline([]);
    setNewsFeed([]);
    setLeagues(LEAGUES_2026);
    setSuperstars(INITIAL_SUPERSTARS);
    setShowCreationModal(false);
    setShowLegendComparison(false);
    setShowMainMenuModal(true);
  };

  // 10. Load Save Slot
  const handleLoadSave = (slot: SaveSlot) => {
    if (slot.player) {
      setPlayer(slot.player);
      setAncestors(slot.legacyTree || []);
      setLegacyScore(slot.legacyScore || 0);
      setCurrentGen(slot.currentGeneration || 1);
      setLocalTimeline(slot.timeline || []);
      setTimelineFeed(slot.timeline || []);
      setNewsFeed(slot.newsFeed || []);
      if (slot.dynamicLeagues) {
        setLeagues(slot.dynamicLeagues);
      }
      if (slot.worldSuperstars && slot.worldSuperstars.length > 0) {
        setSuperstars(slot.worldSuperstars);
      } else {
        setSuperstars(INITIAL_SUPERSTARS);
      }
      setWorldFeed(slot.newsFeed || [], slot.dynamicLeagues || LEAGUES_2026);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center font-sans selection:bg-[#2ECC71] selection:text-black sm:py-6">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 min-h-screen sm:min-h-[820px] sm:max-h-[920px] sm:rounded-[36px] sm:border-[5px] sm:border-[#2A2A2A] bg-[#1E1E1E] relative overflow-hidden shadow-2xl">
        {/* Header */}
        <Header player={player} legacyScore={legacyScore} />

        {/* Tab View Contents */}
        <main className="flex-1 p-4 overflow-y-auto pb-20">
          {player && activeTab === 'home' && (
            <HomeTab
              player={player}
              legacyScore={legacyScore}
              currentGen={currentGen}
              onSimSeason={handleSimSeason}
              onSimCareer={handleSimCareer}
              onRetire={handleRetireClick}
            />
          )}

          {player && activeTab === 'career' && (
            <CareerTab
              player={player}
              timelineFeed={localTimeline}
            />
          )}

          {player && activeTab === 'legacy' && (
            <LegacyTab
              player={player}
              ancestors={ancestors}
              legacyScore={legacyScore}
            />
          )}

          {player && activeTab === 'world' && (
            <WorldTab
              player={player}
              leagues={leagues}
              newsFeed={newsFeed}
              superstars={superstars}
            />
          )}

          {activeTab === 'more' && (
            <MoreTab
              player={player}
              legacyTree={ancestors}
              legacyScore={legacyScore}
              currentGen={currentGen}
              timeline={localTimeline}
              newsFeed={newsFeed}
              leagues={leagues}
              onLoadSave={handleLoadSave}
              onResetData={handleResetData}
              onReturnToMainMenu={handleReturnToMainMenu}
            />
          )}
        </main>

        {/* Footer Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* --- MODALS OVERLAYS --- */}

      {/* Quick Fire / Career Summary Modal */}
      {showQuickFireSummaryModal && player && quickFireSummary && (
        <QuickFireSummaryModal
          player={player}
          summary={quickFireSummary}
          onViewHistory={() => {
            setShowQuickFireSummaryModal(false);
            setActiveTab('career');
          }}
          onContinueAsChild={handleQuickFireContinueAsChild}
          onReturnToMainMenu={handleReturnToMainMenu}
          onNewQuickFire={() => {
            setShowQuickFireSummaryModal(false);
            setShowCreationModal(true);
          }}
        />
      )}

      {/* Creation Modal */}
      {showCreationModal && (
        <CreationModal
          generation={currentGen}
          fatherPlayer={ancestors.length > 0 ? player : null}
          onComplete={handlePlayerCreated}
        />
      )}

      {/* Random Event Modal */}
      {activeRandomEvent && player && (
        <RandomEventModal
          event={activeRandomEvent}
          player={player}
          onResolve={handleRandomEventResolved}
        />
      )}

      {/* Season Summary Modal */}
      {showSeasonSummary && player && pendingSeasonData && (
        <SeasonSummaryModal
          player={player}
          seasonRecord={pendingSeasonData.seasonRecord}
          onProceedToAwards={handleProceedToAwards}
        />
      )}

      {/* Ballon d'Or & Awards Modal */}
      {showAwardsModal && player && pendingSeasonData && (
        <AwardsModal
          player={player}
          ballonDor={pendingSeasonData.ballonDor}
          mediaVerdict={pendingSeasonData.mediaVerdict}
          goldenShoeWon={pendingSeasonData.goldenShoeWon}
          onContinue={handleProceedToTransfers}
        />
      )}

      {/* Transfer Offer Selection Modal */}
      {activeTransferOffers && player && (
        <TransferModal
          player={player}
          offers={activeTransferOffers}
          onSelectOffer={handleOfferSelected}
        />
      )}

      {/* Retirement Modal */}
      {showRetirementModal && player && (
        <RetirementModal
          player={player}
          onProceedToChild={handleProceedToChildCreation}
        />
      )}

      {/* Main Menu Modal */}
      {showMainMenuModal && (
        <MainMenuModal
          onSelectStandardCareer={() => {
            setShowMainMenuModal(false);
            setShowCreationModal(true);
          }}
          onSelectQuickFireCareer={() => {
            setShowMainMenuModal(false);
            setShowCreationModal(true);
          }}
          onSelectLegendCareer={handleSelectLegendCareer}
        />
      )}

      {/* Legend Mode Retirement Comparison Modal */}
      {showLegendComparison && player && (
        <LegendComparisonModal
          player={player}
          onReturnToMainMenu={handleReturnToMainMenu}
        />
      )}
    </div>
  );
}
