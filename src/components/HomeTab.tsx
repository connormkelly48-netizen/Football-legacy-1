import React, { useState } from 'react';
import { Player } from '../types';
import { Trophy, Zap, Shield, Sparkles, UserCheck, Flame, Rocket } from 'lucide-react';
import { sound } from '../utils/audio';
import { googlePlayBilling } from '../utils/googlePlayBilling';
import { formatOvr } from '../utils/format';

interface HomeTabProps {
  player: Player;
  legacyScore: number;
  currentGen: number;
  onSimSeason: () => void;
  onSimCareer: () => void;
  onRetire: () => void;
}

export const getLegacyRank = (score: number) => {
  if (score >= 250000) return { title: "Immortal", icon: "👑", color: "text-amber-300", badge: "bg-amber-500/20 border-amber-500" };
  if (score >= 100000) return { title: "Icon", icon: "💎", color: "text-cyan-400", badge: "bg-cyan-500/20 border-cyan-500" };
  if (score >= 50000) return { title: "Legend", icon: "🌟", color: "text-amber-400", badge: "bg-amber-500/20 border-amber-400" };
  if (score >= 20000) return { title: "Elite", icon: "🔥", color: "text-rose-400", badge: "bg-rose-500/20 border-rose-400" };
  if (score >= 5000) return { title: "Professional", icon: "⚽", color: "text-emerald-400", badge: "bg-emerald-500/20 border-emerald-400" };
  return { title: "Amateur", icon: "🥉", color: "text-neutral-400", badge: "bg-neutral-800 border-neutral-700" };
};

export const HomeTab: React.FC<HomeTabProps> = ({
  player,
  legacyScore,
  currentGen,
  onSimSeason,
  onSimCareer,
  onRetire
}) => {
  const [showSimCareerConfirm, setShowSimCareerConfirm] = useState<boolean>(false);
  const rank = getLegacyRank(legacyScore);

  const handleSimSeasonClick = () => {
    sound.playSimStart();
    onSimSeason();
  };

  const handleConfirmSimCareer = () => {
    setShowSimCareerConfirm(false);
    sound.playSimStart();
    onSimCareer();
  };

  // Estimated Market Value
  const estimatedVal = Math.round((Math.pow(player.ovr / 50, 4) * Math.max(1, (34 - player.age) * 0.8)) * 10) / 10;

  return (
    <div className="space-y-4">
      {/* 🏆 LEGACY SCORE WIDGET */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-[#F1C40F]/30 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-[#F1C40F]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#F1C40F]">
              LEGACY SCORE
            </span>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${rank.badge} ${rank.color}`}>
            {rank.icon} {rank.title}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5">
            <div className="text-[9px] uppercase font-bold text-white/40">Points</div>
            <div className="text-xl font-black font-mono text-[#F1C40F] mt-0.5">
              {legacyScore.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5">
            <div className="text-[9px] uppercase font-bold text-white/40">Family Tree</div>
            <div className="text-xl font-black font-mono text-white mt-0.5">
              Gen {currentGen}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-white/60">
          <span>Active Player: <span className="text-white font-bold">{player.name}</span></span>
          <span>Hall of Fame: <span className="text-[#2ECC71] font-bold">{player.ovr >= 85 || player.ballonDorsWon >= 1 ? 'YES' : 'NO'}</span></span>
        </div>
      </div>

      {/* 👤 PLAYER PROFILE CARD */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
              PLAYER SNAPSHOT
            </span>
          </div>
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{player.nationality}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">{player.name}</h2>
              {(googlePlayBilling.getActiveBadge() || player.supporterBadge) && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/40 text-[#2ECC71] font-bold inline-flex items-center">
                  {googlePlayBilling.getActiveBadge() || player.supporterBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 mt-0.5 italic font-serif">
              {player.club} • Age {player.age} • <span className="font-bold text-[#2ECC71] not-italic">{player.position}</span>
            </p>
          </div>

          <div className="text-right bg-[#1E1E1E] px-3 py-1.5 rounded-xl border border-white/5">
            <div className="text-2xl font-black font-mono text-[#2ECC71] leading-none">{formatOvr(player.ovr)}</div>
            <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">OVR</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] uppercase text-white/40 font-bold block mb-0.5">Media Potential</span>
            <span className="font-bold font-mono text-[#F1C40F] text-sm">{player.mediaPot} OVR</span>
          </div>
          <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] uppercase text-white/40 font-bold block mb-0.5">Market Value</span>
            <span className="font-bold font-mono text-[#2ECC71] text-sm">€{estimatedVal > 0 ? `${estimatedVal}M` : '€0.5M'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-xl border border-white/5 text-xs">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#2ECC71]" />
            <div>
              <div className="text-[9px] uppercase font-bold text-white/40">Current Club</div>
              <div className="font-bold text-white">{player.club}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-white/40">Contract</div>
            <div className="font-semibold text-[#2ECC71]">Active (1 Yr)</div>
          </div>
        </div>
      </div>

      {/* 🏷️ PLAYER TRAITS */}
      {player.traits && player.traits.length > 0 && (
        <div className="bg-[#2A2A2A] rounded-xl p-3.5 border border-white/5 space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F1C40F]" />
            <span className="text-[9px] font-black text-[#F1C40F] uppercase tracking-widest">
              ACTIVE TRAITS
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {player.traits.map(t => (
              <span
                key={t.id}
                className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#1E1E1E] border border-white/10 text-white/90"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ⚡ SIM SEASON & 🚀 SIM CAREER BUTTONS */}
      <div className="pt-2 space-y-2">
        {player.age < 38 ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSimSeasonClick}
              className="bg-[#2ECC71] hover:bg-[#27ae60] text-black h-14 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-[0_10px_20px_rgba(46,204,113,0.2)] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <div className="text-left leading-tight">
                <div className="font-black uppercase tracking-wider text-xs">SIM SEASON</div>
                <div className="text-[10px] opacity-80 font-mono font-bold">{player.year}</div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setShowSimCareerConfirm(true);
              }}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black h-14 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-[0_10px_20px_rgba(245,158,11,0.2)] active:scale-[0.98] cursor-pointer"
            >
              <Rocket className="w-4 h-4 fill-current" />
              <div className="text-left leading-tight">
                <div className="font-black uppercase tracking-wider text-xs">SIM CAREER</div>
                <div className="text-[10px] opacity-80 font-mono font-bold">FULL CAREER</div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="bg-[#F1C40F]/10 border border-[#F1C40F]/30 rounded-2xl p-3 text-center text-xs text-[#F1C40F]">
              👴 At age {player.age}, your player has reached the veteran retirement milestone!
            </div>
            <button
              onClick={onRetire}
              className="w-full bg-[#F1C40F] hover:bg-[#d4ac0d] text-black h-14 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-[0_10px_20px_rgba(241,196,15,0.2)] active:scale-[0.98] cursor-pointer font-black uppercase tracking-wider text-sm"
            >
              <Trophy className="w-5 h-5 fill-current" />
              <span>RETIRE & START GENERATION {currentGen + 1}</span>
            </button>
          </div>
        )}
      </div>

      {/* SIM CAREER CONFIRMATION MODAL */}
      {showSimCareerConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2A2A2A] border border-white/10 rounded-2xl max-w-sm w-full p-5 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <Rocket className="w-6 h-6 fill-current" />
            </div>

            <div>
              <h3 className="text-base font-black text-white font-serif">Simulate Remaining Career?</h3>
              <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                This will simulate every remaining season until retirement automatically using AI personality decision logic based on your hidden traits.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowSimCareerConfirm(false)}
                className="bg-[#1E1E1E] hover:bg-white/10 text-white/80 font-bold text-xs py-2.5 rounded-xl border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSimCareer}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-black text-xs py-2.5 rounded-xl shadow-lg cursor-pointer"
              >
                Sim Career
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
