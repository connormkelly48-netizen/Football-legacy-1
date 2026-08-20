import React from 'react';
import { Player } from '../types';
import { Trophy, Star, Sparkles, UserPlus } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatOvr } from '../utils/format';

interface RetirementModalProps {
  player: Player;
  onProceedToChild: () => void;
}

export const RetirementModal: React.FC<RetirementModalProps> = ({
  player,
  onProceedToChild
}) => {
  const isHallOfFame = player.ovr >= 85 || player.ballonDorsWon >= 1;

  const handleProceed = () => {
    sound.playTrophyFanfare();
    onProceedToChild();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#F1C40F]/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl">
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-[#F1C40F]/20 border border-[#F1C40F]/50 text-[#F1C40F] mb-1">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-[#F1C40F] uppercase tracking-wider">
            CAREER RETIREMENT SUMMARY
          </h2>
          <p className="text-xs text-white/50">
            {player.name} has officially hung up their boots at age {player.age}.
          </p>
        </div>

        {/* 📊 CAREER TOTALS */}
        <div className="bg-[#2A2A2A] p-4 rounded-xl border border-white/5 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-white text-sm italic font-serif">{player.name}</span>
            <span className="text-[#F1C40F] font-bold font-mono">Peak {formatOvr(player.ovr)} OVR</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-[#1E1E1E] p-2 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Total Apps</span>
              <span className="font-bold text-white text-sm">{player.totalApps}</span>
            </div>
            <div className="bg-[#1E1E1E] p-2 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Total Goals</span>
              <span className="font-bold text-[#2ECC71] text-sm">{player.totalGoals}</span>
            </div>
            <div className="bg-[#1E1E1E] p-2 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Club Trophies</span>
              <span className="font-bold text-[#F1C40F] text-sm">{player.totalTrophies}</span>
            </div>
            <div className="bg-[#1E1E1E] p-2 rounded-lg border border-white/5">
              <span className="text-[9px] uppercase font-bold text-white/40 block">Ballon d'Ors</span>
              <span className="font-bold text-[#F1C40F] text-sm">{player.ballonDorsWon}</span>
            </div>
          </div>
        </div>

        {/* 👑 HALL OF FAME INDUCTION */}
        {isHallOfFame && (
          <div className="bg-[#F1C40F]/10 border border-[#F1C40F]/40 p-3 rounded-xl flex items-center space-x-3 text-xs">
            <Star className="w-6 h-6 text-[#F1C40F] shrink-0" />
            <div>
              <div className="font-bold text-[#F1C40F]">INDUCTED INTO THE HALL OF FAME!</div>
              <div className="text-[10px] text-white/50">Achieved immortal status with legendary career milestones.</div>
            </div>
          </div>
        )}

        <button
          onClick={handleProceed}
          className="w-full bg-[#F1C40F] hover:bg-[#f39c12] text-black font-black text-xs py-3.5 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer"
        >
          <UserPlus className="w-4 h-4 fill-current" />
          <span>BIRTH GENERATION {player.generation + 1} CHILD CHARACTER</span>
        </button>
      </div>
    </div>
  );
};
