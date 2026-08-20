import React from 'react';
import { Player, QuickFireSummaryData } from '../types';
import { Trophy, Star, Award, Flame, UserCheck, Home, RotateCcw, ChevronRight, Globe, Shield, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatOvr } from '../utils/format';

interface QuickFireSummaryModalProps {
  player: Player;
  summary: QuickFireSummaryData;
  onViewHistory: () => void;
  onContinueAsChild: () => void;
  onReturnToMainMenu: () => void;
  onNewQuickFire: () => void;
}

export const QuickFireSummaryModal: React.FC<QuickFireSummaryModalProps> = ({
  player,
  summary,
  onViewHistory,
  onContinueAsChild,
  onReturnToMainMenu,
  onNewQuickFire
}) => {
  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'LEGENDARY': return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black border-amber-300';
      case 'S': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-400';
      case 'A': return 'bg-[#2ECC71] text-black border-emerald-400';
      case 'B': return 'bg-blue-500 text-white border-blue-400';
      default: return 'bg-slate-600 text-white border-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="bg-[#2A2A2A] border border-white/10 rounded-2xl max-w-lg w-full p-5 space-y-4 text-white shadow-2xl my-auto">
        
        {/* Header Header Banner */}
        <div className="text-center space-y-2 border-b border-white/10 pb-4">
          <div className="inline-flex items-center space-x-1.5 bg-yellow-500/20 text-[#F1C40F] border border-yellow-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-mono">
            <Trophy className="w-3.5 h-3.5 fill-current" />
            <span>CAREER COMPLETE</span>
          </div>

          <h2 className="text-2xl font-black italic font-serif tracking-tight text-white mt-1">
            {player.name}
          </h2>

          <div className="flex items-center justify-center space-x-2 text-xs text-white/60">
            <span>{player.position}</span>
            <span>•</span>
            <span>Gen {player.generation}</span>
            <span>•</span>
            <span>{summary.startYear} – {summary.endYear} ({summary.careerLength} Yrs)</span>
          </div>

          {/* Rating Badge */}
          <div className="pt-2 flex items-center justify-center space-x-3">
            <div className={`px-4 py-1.5 rounded-xl border text-sm font-black font-mono shadow-lg ${getRatingBadgeColor(summary.careerRating)}`}>
              CAREER GRADE: {summary.careerRating}
            </div>
            <div className="bg-[#1E1E1E] px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold font-mono text-[#2ECC71]">
              {formatOvr(summary.peakOvr)} PEAK OVR
            </div>
          </div>
        </div>

        {/* Career Key Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] text-white/40 uppercase font-bold">Total Apps</div>
            <div className="text-base font-black font-mono text-white mt-0.5">{summary.totalApps}</div>
          </div>
          <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] text-white/40 uppercase font-bold">Goals / Assists</div>
            <div className="text-base font-black font-mono text-[#2ECC71] mt-0.5">{summary.totalGoals} / {summary.totalAssists}</div>
          </div>
          <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] text-white/40 uppercase font-bold">Trophies</div>
            <div className="text-base font-black font-mono text-[#F1C40F] mt-0.5">{summary.totalTrophies}</div>
          </div>

          <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] text-white/40 uppercase font-bold">Ballon d'Or</div>
            <div className="text-base font-black font-mono text-[#F1C40F] mt-0.5">{summary.ballonDorsWon}</div>
          </div>
          <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] text-white/40 uppercase font-bold">Int Caps/Goals</div>
            <div className="text-base font-black font-mono text-cyan-400 mt-0.5">{summary.intCaps} ({summary.intGoals})</div>
          </div>
          <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
            <div className="text-[9px] text-white/40 uppercase font-bold">Legacy Score</div>
            <div className="text-base font-black font-mono text-amber-400 mt-0.5">{summary.legacyScore}</div>
          </div>
        </div>

        {/* Hall of Fame & Records */}
        <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <span className="text-[9px] font-black uppercase text-white/40 font-mono">HALL OF FAME STATUS</span>
            <span className="font-bold text-[#F1C40F]">{summary.hallOfFameStatus}</span>
          </div>

          {summary.recordsBroken.length > 0 && (
            <div>
              <div className="text-[9px] font-black uppercase text-white/40 font-mono mb-1">RECORDS & MILESTONES</div>
              <div className="flex flex-wrap gap-1">
                {summary.recordsBroken.map((rec, i) => (
                  <span key={i} className="text-[9px] bg-white/5 text-[#2ECC71] border border-[#2ECC71]/30 px-2 py-0.5 rounded font-mono">
                    ✓ {rec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clubs Played For */}
        <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 space-y-2 max-h-36 overflow-y-auto">
          <div className="text-[9px] font-black uppercase text-white/40 font-mono">CLUBS REPRESENTED</div>
          <div className="space-y-1.5 text-xs">
            {summary.clubsPlayed.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-[#2A2A2A] p-2 rounded-lg border border-white/5">
                <div className="font-bold text-white font-serif italic text-xs">{c.clubName}</div>
                <div className="text-[10px] text-white/60 font-mono space-x-2">
                  <span>{c.years} yrs</span>
                  <span>•</span>
                  <span>{c.goals} goals</span>
                  {c.trophies > 0 && <span className="text-[#F1C40F]"> • {c.trophies} 🏆</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playTap();
                onViewHistory();
              }}
              className="bg-[#1E1E1E] hover:bg-white/10 text-white font-bold text-xs py-2.5 rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#F1C40F]" />
              <span>Full History</span>
            </button>

            <button
              onClick={() => {
                sound.playSuccess();
                onContinueAsChild();
              }}
              className="bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-[#2ECC71]/20"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Continue As Child</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playTap();
                onNewQuickFire();
              }}
              className="bg-[#2A2A2A] hover:bg-[#1E1E1E] text-white/80 border border-white/10 text-xs py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Career</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                onReturnToMainMenu();
              }}
              className="bg-[#2A2A2A] hover:bg-[#1E1E1E] text-white/80 border border-white/10 text-xs py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-white/50" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
