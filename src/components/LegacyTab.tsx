import React from 'react';
import { Player, Ancestor } from '../types';
import { Crown, Trophy, Sparkles, Star, ShieldCheck } from 'lucide-react';
import { getLegacyRank } from './HomeTab';
import { formatOvr } from '../utils/format';

interface LegacyTabProps {
  player: Player;
  ancestors: Ancestor[];
  legacyScore: number;
}

export const LegacyTab: React.FC<LegacyTabProps> = ({ player, ancestors, legacyScore }) => {
  const rank = getLegacyRank(legacyScore);

  return (
    <div className="space-y-4">
      {/* 👑 DYNASTY OVERVIEW HEADER */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-[#F1C40F]/30 space-y-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-[#F1C40F]" />
            <h2 className="text-[9px] font-black uppercase tracking-widest text-[#F1C40F]">
              DYNASTY HERITAGE & FAMILY TREE
            </h2>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${rank.badge} ${rank.color}`}>
            {rank.icon} {rank.title}
          </span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">
          Your footballing family spans across multiple generations. Every goal scored, trophy won, and Ballon d'Or earned compounds your overall family legacy score.
        </p>
      </div>

      {/* 🌲 FAMILY TREE NODES */}
      <div className="space-y-3">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 px-1">
          ANCESTRAL RECORD ({ancestors.length + 1} GENERATIONS)
        </h3>

        {/* Current Active Player */}
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border-2 border-[#2ECC71] shadow-lg relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#2ECC71] text-black">
              Gen {player.generation || 1} • ACTIVE DYNAST
            </span>
            <span className="text-xs font-black font-mono text-[#2ECC71]">{formatOvr(player.ovr)} OVR</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-extrabold text-white">{player.name}</h4>
              <p className="text-xs text-white/60 font-serif italic">
                {player.nationality} • {player.position} • {player.club}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center text-[10px] bg-[#1E1E1E] p-2.5 rounded-xl mt-3 border border-white/5 font-mono">
            <div>Apps: <span className="text-white font-bold">{player.totalApps}</span></div>
            <div>Goals: <span className="text-[#2ECC71] font-bold">{player.totalGoals}</span></div>
            <div>Trophies: <span className="text-[#F1C40F] font-bold">{player.totalTrophies}</span></div>
            <div>Ballon d'Ors: <span className="text-[#F1C40F] font-bold">{player.ballonDorsWon}</span></div>
          </div>
        </div>

        {/* Retired Ancestors */}
        {ancestors.length === 0 ? (
          <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-white/5 text-center text-white/40 text-xs italic">
            You are currently playing as Generation 1. Retire this player to birth Generation 2!
          </div>
        ) : (
          ancestors.slice().reverse().map(ancestor => (
            <div key={ancestor.generation} className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 relative shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#1E1E1E] text-white/60 border border-white/10">
                  Gen {ancestor.generation} • RETIRED ({ancestor.startYear}-{ancestor.retireYear})
                </span>
                <span className="text-xs font-black font-mono text-[#F1C40F]">Peak {formatOvr(ancestor.peakOvr)} OVR</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center space-x-1.5">
                    <span>{ancestor.name}</span>
                    {ancestor.hallOfFame && <span title="Hall of Fame Inductee">👑</span>}
                  </h4>
                  <p className="text-xs text-white/60 font-serif italic">
                    {ancestor.nationality} • {ancestor.position} • Final Club: {ancestor.finalClub}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center text-[10px] bg-[#1E1E1E] p-2.5 rounded-xl mt-3 border border-white/5 font-mono">
                <div>Apps: <span className="text-white font-bold">{ancestor.totalApps}</span></div>
                <div>Goals: <span className="text-[#2ECC71] font-bold">{ancestor.totalGoals}</span></div>
                <div>Trophies: <span className="text-[#F1C40F] font-bold">{ancestor.totalTrophies}</span></div>
                <div>Ballon d'Ors: <span className="text-[#F1C40F] font-bold">{ancestor.ballonDorsWon}</span></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📊 LEGACY SCORE SCORING FORMULA */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-2 text-xs shadow-md">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-[#F1C40F]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F1C40F]">
            HOW LEGACY SCORE IS CALCULATED
          </span>
        </div>
        <ul className="space-y-1.5 text-white/70">
          <li className="flex items-center justify-between">
            <span>⚽ Goal Scored</span>
            <span className="font-bold font-mono text-[#2ECC71]">+100 Pts</span>
          </li>
          <li className="flex items-center justify-between">
            <span>🎯 Goal Assist</span>
            <span className="font-bold font-mono text-cyan-400">+50 Pts</span>
          </li>
          <li className="flex items-center justify-between">
            <span>🏆 Club / Int. Trophy Won</span>
            <span className="font-bold font-mono text-[#F1C40F]">+1,500 Pts</span>
          </li>
          <li className="flex items-center justify-between">
            <span>👑 Ballon d'Or Award</span>
            <span className="font-bold font-mono text-[#F1C40F]">+5,000 Pts</span>
          </li>
          <li className="flex items-center justify-between">
            <span>📈 Peak OVR Milestone (85+)</span>
            <span className="font-bold font-mono text-purple-400">+2,000 Pts</span>
          </li>
        </ul>
      </div>

      {/* 👑 HALL OF FAME SHOWCASE */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-md">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
            HALL OF FAME INDUCTEES
          </span>
        </div>

        {ancestors.filter(a => a.hallOfFame).length === 0 ? (
          <p className="text-xs text-white/40 text-center py-4 italic">
            No family members inducted yet. Players with Peak OVR 85+ or 3+ Ballon d'Ors enter automatically upon retirement!
          </p>
        ) : (
          <div className="space-y-2">
            {ancestors.filter(a => a.hallOfFame).map((hof, idx) => (
              <div key={idx} className="bg-[#F1C40F]/10 border border-[#F1C40F]/30 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#F1C40F] text-sm block">{hof.name}</span>
                  <span className="text-[10px] text-white/50">Gen {hof.generation} • Peak OVR {formatOvr(hof.peakOvr)}</span>
                </div>
                <div className="text-right">
                  <Star className="w-4 h-4 text-[#F1C40F] inline-block mb-1" />
                  <div className="text-[10px] text-[#F1C40F] font-bold font-mono">{hof.ballonDorsWon} Ballon d'Ors</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
