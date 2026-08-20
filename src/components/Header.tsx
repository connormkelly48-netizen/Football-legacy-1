import React from 'react';
import { Player } from '../types';
import { googlePlayBilling } from '../utils/googlePlayBilling';
import { formatOvr } from '../utils/format';

interface HeaderProps {
  player: Player | null;
  legacyScore: number;
}

export const Header: React.FC<HeaderProps> = ({ player, legacyScore }) => {
  const clubColor = player ? player.clubColor || '#2ECC71' : '#2ECC71';
  const activeBadge = googlePlayBilling.getActiveBadge() || player?.supporterBadge;

  return (
    <header 
      className="bg-[#2A2A2A] border-b border-white/10 transition-colors duration-300 relative shadow-md"
    >
      {/* Early Access Notice */}
      <div 
        className="px-3 pt-1.5 pb-1 text-[10px] sm:text-[11px] text-white/75 tracking-tight font-normal leading-tight select-none bg-black/20 border-b border-white/5 flex justify-between items-center"
      >
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {player && (
            <span className="font-bold text-white flex items-center truncate">
              {player.name}
              {activeBadge && (
                <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#2ECC71]/20 border border-[#2ECC71]/40 text-[#2ECC71] font-bold inline-flex items-center shrink-0">
                  {activeBadge}
                </span>
              )}
            </span>
          )}
        </div>
        <span className="text-white/50 text-[9px] uppercase tracking-wider shrink-0 ml-2">EARLY ACCESS</span>
      </div>

      <div className="p-3.5 flex items-center justify-between max-w-lg mx-auto">
        <div className="text-left">
          <h1 className="text-sm font-extrabold tracking-wider text-[#F1C40F] uppercase">
            FOOTBALL LEGACY
          </h1>
          <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-0.5">
            {player ? `${player.club} • ${player.year}` : 'Season Setup'}
          </div>
        </div>

        {player && (
          <div className="flex items-center space-x-2 bg-[#1E1E1E] px-3 py-1 rounded-lg border border-white/10 shadow-inner">
            <span className="text-xs font-bold text-[#2ECC71]">{player.position}</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-sm font-black font-mono text-white">
              {formatOvr(player.ovr)} <span className="text-[9px] text-white/40 font-normal">OVR</span>
            </span>
          </div>
        )}
      </div>

      {/* Subtle Club Color Bottom Accent Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-80"
        style={{ backgroundColor: clubColor }}
      />
    </header>
  );
};
