import React from 'react';
import { Player } from '../types';
import { RealCareerBaseline } from '../data/legendPlayers';
import { Trophy, Crown, Sparkles, Home, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatOvr } from '../utils/format';

interface LegendComparisonModalProps {
  player: Player & { realBaseline?: RealCareerBaseline; isLegendMode?: boolean };
  onReturnToMainMenu: () => void;
}

export const LegendComparisonModal: React.FC<LegendComparisonModalProps> = ({
  player,
  onReturnToMainMenu
}) => {
  const baseline = player.realBaseline || {
    careerGoals: 500,
    careerAssists: 200,
    careerTrophies: 20,
    careerCaps: 100,
    peakMarketValue: '€100M',
    careerLength: 15,
    clubsPlayedFor: [player.club],
    historicalSummary: 'Iconic legendary professional career.'
  };

  const simPeakOvr = Math.max(player.ovr, ...player.history.map(h => h.newOvr || player.ovr));
  const simCareerLength = player.history.length || 1;
  const uniqueClubs = Array.from(new Set(player.history.map(h => h.club).concat([player.club])));

  // Auto-generate comparison summary line
  const goalDiff = player.totalGoals - baseline.careerGoals;
  const trophyDiff = player.totalTrophies - baseline.careerTrophies;
  
  let summaryText = `Your simulated career as ${player.name} concluded with ${player.totalGoals} goals and ${player.totalTrophies} trophies. `;
  if (goalDiff > 0) {
    summaryText += `You outperformed the real-life goal tally by ${goalDiff} goals! `;
  } else if (goalDiff < 0) {
    summaryText += `You finished ${Math.abs(goalDiff)} goals shy of the real-life baseline. `;
  }

  if (trophyDiff > 0) {
    summaryText += `You captured ${trophyDiff} more trophies than in reality.`;
  } else if (trophyDiff < 0) {
    summaryText += `You secured ${Math.abs(trophyDiff)} fewer trophies than the historical record.`;
  } else {
    summaryText += `Your trophy haul matched the exact historical record!`;
  }

  const handleReturn = () => {
    sound.playSuccess();
    onReturnToMainMenu();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-purple-500/50 rounded-2xl w-full max-w-lg p-5 text-white space-y-4 shadow-2xl max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 mb-1">
            <Crown className="w-8 h-8 fill-purple-500/20" />
          </div>
          <h2 className="text-lg font-black text-purple-400 uppercase tracking-wider">
            LEGEND MODE • CAREER COMPARISON
          </h2>
          <p className="text-xs text-white/50">
            {player.name} has retired at age {player.age}. Here is how your simulated timeline compares to reality.
          </p>
        </div>

        {/* 📊 SIDE-BY-SIDE STATS COMPARISON */}
        <div className="bg-[#2A2A2A] p-4 rounded-xl border border-white/5 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-white text-sm italic font-serif">{player.name}</span>
            <span className="text-purple-400 font-bold font-mono">Peak {formatOvr(simPeakOvr)} OVR</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-[#1E1E1E] p-2.5 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Metric</span>
              <span className="font-bold text-white text-[11px] block mt-1">Simulated</span>
              <span className="font-bold text-purple-300 text-[11px] block mt-1">Real Baseline</span>
            </div>

            <div className="bg-[#1E1E1E] p-2.5 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Goals</span>
              <span className="font-bold text-[#2ECC71] text-sm block mt-0.5">{player.totalGoals}</span>
              <span className="font-bold text-white/60 text-xs block mt-1">{baseline.careerGoals}</span>
            </div>

            <div className="bg-[#1E1E1E] p-2.5 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Trophies</span>
              <span className="font-bold text-[#F1C40F] text-sm block mt-0.5">{player.totalTrophies}</span>
              <span className="font-bold text-white/60 text-xs block mt-1">{baseline.careerTrophies}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-[#1E1E1E] p-2 rounded border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Assists</span>
              <span className="font-bold text-white">{player.totalAssists}</span>
              <span className="text-[10px] text-white/50 block">{baseline.careerAssists} real</span>
            </div>
            <div className="bg-[#1E1E1E] p-2 rounded border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Int. Caps</span>
              <span className="font-bold text-cyan-300">{player.intCaps}</span>
              <span className="text-[10px] text-white/50 block">{baseline.careerCaps} real</span>
            </div>
            <div className="bg-[#1E1E1E] p-2 rounded border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Seasons</span>
              <span className="font-bold text-amber-400">{simCareerLength} yrs</span>
              <span className="text-[10px] text-white/50 block">{baseline.careerLength} real</span>
            </div>
          </div>

          <div className="bg-[#1E1E1E] p-3 rounded-lg border border-white/5 text-[11px] space-y-1">
            <div className="text-[9px] uppercase font-bold text-white/40">Clubs Played For</div>
            <div className="text-white/90 font-bold">
              Simulated: <span className="text-purple-300">{uniqueClubs.join(', ')}</span>
            </div>
            <div className="text-white/60 text-[10px]">
              Real Life: {baseline.clubsPlayedFor.join(', ')}
            </div>
          </div>
        </div>

        {/* 🤖 AUTO-GENERATED SUMMARY */}
        <div className="bg-purple-500/10 border border-purple-500/30 p-3.5 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center space-x-2 text-purple-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Legacy Divergence Analysis</span>
          </div>
          <p className="text-white/80 leading-relaxed italic font-serif">
            "{summaryText}"
          </p>
        </div>

        <button
          onClick={handleReturn}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3.5 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO MAIN MENU</span>
        </button>

      </div>
    </div>
  );
};
