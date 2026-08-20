import React, { useState } from 'react';
import { Trophy, Zap, Crown, Sparkles, ChevronRight, Play } from 'lucide-react';
import { sound } from '../utils/audio';
import { isLegendModeUnlocked } from '../utils/legendBilling';
import { LegendPurchaseModal } from './LegendPurchaseModal';
import { LegendPlayerSelectModal } from './LegendPlayerSelectModal';
import { Player } from '../types';

interface MainMenuModalProps {
  onSelectStandardCareer: () => void;
  onSelectQuickFireCareer: () => void;
  onSelectLegendCareer: (player: Player) => void;
}

export const MainMenuModal: React.FC<MainMenuModalProps> = ({
  onSelectStandardCareer,
  onSelectQuickFireCareer,
  onSelectLegendCareer,
}) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [showPlayerSelectModal, setShowPlayerSelectModal] = useState<boolean>(false);

  const handleLegendModeClick = () => {
    sound.playTap();
    if (isLegendModeUnlocked()) {
      setShowPlayerSelectModal(true);
    } else {
      setShowPurchaseModal(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#2ECC71]/40 rounded-3xl w-full max-w-md p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Background Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2ECC71]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex p-3.5 rounded-2xl bg-[#2ECC71]/10 border border-[#2ECC71]/30 text-[#2ECC71] mb-1 shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase font-serif">
            FOOTBALL LEGACY
          </h1>
          <p className="text-xs text-white/50 max-w-xs mx-auto">
            Experience the ultimate mobile football career simulator. Build a generational dynasty or rewrite history.
          </p>
        </div>

        <div className="space-y-3 relative z-10">
          {/* 1. Career Mode */}
          <button
            onClick={() => {
              sound.playTap();
              onSelectStandardCareer();
            }}
            className="w-full bg-[#2A2A2A] hover:bg-[#333333] border border-white/10 hover:border-[#2ECC71]/50 p-4 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer shadow-lg"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71]">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white group-hover:text-[#2ECC71] transition-colors">
                  Career Mode (Dynasty)
                </div>
                <div className="text-[10px] text-white/50 mt-0.5">
                  Create a player, build your legacy, and pass the torch to your children
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </button>

          {/* 2. Quick-Fire Career */}
          <button
            onClick={() => {
              sound.playTap();
              onSelectQuickFireCareer();
            }}
            className="w-full bg-[#2A2A2A] hover:bg-[#333333] border border-white/10 hover:border-amber-400/50 p-4 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer shadow-lg"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors">
                  Quick-Fire Career
                </div>
                <div className="text-[10px] text-white/50 mt-0.5">
                  Fast-paced automated career simulation mode with instant results
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </button>

          {/* 3. Legend Mode (DLC) */}
          <button
            onClick={handleLegendModeClick}
            className="w-full bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/40 p-4 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer shadow-xl relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center space-x-3.5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Crown className="w-5 h-5 fill-purple-500/30" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-purple-300 group-hover:text-purple-200 transition-colors flex items-center space-x-2">
                  <span>Legend Mode</span>
                  <span className="text-[9px] bg-purple-500/30 text-purple-200 border border-purple-500/50 px-2 py-0.5 rounded-full font-mono uppercase">
                    {isLegendModeUnlocked() ? 'UNLOCKED' : 'DLC'}
                  </span>
                </div>
                <div className="text-[10px] text-white/60 mt-0.5">
                  Play as real-world football icons & compare legacies on retirement
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors relative z-10" />
          </button>
        </div>

        <div className="text-center text-[10px] text-white/40 pt-2 font-mono">
          Football Legacy • Mobile Edition
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <LegendPurchaseModal
          onUnlocked={() => {
            setShowPurchaseModal(false);
            setShowPlayerSelectModal(true);
          }}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

      {/* Player Select Modal */}
      {showPlayerSelectModal && (
        <LegendPlayerSelectModal
          onSelectLegend={player => {
            setShowPlayerSelectModal(false);
            onSelectLegendCareer(player);
          }}
          onClose={() => setShowPlayerSelectModal(false)}
        />
      )}
    </div>
  );
};
