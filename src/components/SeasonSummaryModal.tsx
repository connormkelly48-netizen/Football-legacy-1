import React from 'react';
import { SeasonRecord, Player } from '../types';
import { Trophy, TrendingUp, Sparkles, Award } from 'lucide-react';
import { formatOvr, formatOvrDelta } from '../utils/format';
import { sound } from '../utils/audio';

interface SeasonSummaryModalProps {
  player: Player;
  seasonRecord: SeasonRecord;
  onProceedToAwards: () => void;
}

export const SeasonSummaryModal: React.FC<SeasonSummaryModalProps> = ({
  player,
  seasonRecord,
  onProceedToAwards
}) => {
  const handleProceed = () => {
    sound.playTap();
    onProceedToAwards();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#2ECC71]/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl">
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/50 text-[#2ECC71] mb-1">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            SEASON {seasonRecord.year} CONCLUDED
          </h2>
          <p className="text-xs text-white/50 italic font-serif">{seasonRecord.club} • Age {seasonRecord.age}</p>
        </div>

        {/* 📊 STATS GRID */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-[#2A2A2A] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] uppercase font-bold text-white/40 block">Appearances</span>
            <span className="text-base font-black font-mono text-white mt-0.5 block">{seasonRecord.apps}</span>
          </div>
          <div className="bg-[#2A2A2A] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] uppercase font-bold text-white/40 block">Goals Scored</span>
            <span className="text-base font-black font-mono text-[#2ECC71] mt-0.5 block">{seasonRecord.goals}</span>
          </div>
          <div className="bg-[#2A2A2A] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] uppercase font-bold text-white/40 block">Assists</span>
            <span className="text-base font-black font-mono text-cyan-400 mt-0.5 block">{seasonRecord.assists}</span>
          </div>
          <div className="bg-[#2A2A2A] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] uppercase font-bold text-white/40 block">Average Rating</span>
            <span className="text-base font-black font-mono text-[#F1C40F] mt-0.5 block">{seasonRecord.rating}</span>
          </div>
        </div>

        {/* 📈 OVR DEVELOPMENT CHANGE */}
        <div className="bg-[#2A2A2A] p-3.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="text-white/40 text-[9px] font-bold uppercase block">DEVELOPMENT CHANGE</span>
            <span className="font-bold font-mono text-white text-sm">
              {formatOvr(seasonRecord.oldOvr)} ➔ {formatOvr(seasonRecord.newOvr)} OVR
            </span>
          </div>
          <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg ${
            seasonRecord.ovrChange >= 0 
              ? 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40' 
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}>
            {formatOvrDelta(seasonRecord.ovrChange)} OVR
          </span>
        </div>

        {/* 🏆 TROPHIES WON */}
        {seasonRecord.trophiesWon && seasonRecord.trophiesWon.length > 0 && (
          <div className="bg-[#F1C40F]/10 border border-[#F1C40F]/30 p-3 rounded-xl flex items-center space-x-3 text-xs">
            <Trophy className="w-6 h-6 text-[#F1C40F] shrink-0" />
            <div>
              <div className="font-bold text-[#F1C40F]">
                {seasonRecord.trophiesWon.length > 1 ? `${seasonRecord.trophiesWon.length}-Trophy Season!` : 'Silverware Champions!'}
              </div>
              <div className="text-[10px] text-white/50">Won the {seasonRecord.trophiesWon.join(', ')}!</div>
            </div>
          </div>
        )}

        <button
          onClick={handleProceed}
          className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-3.5 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer"
        >
          <Award className="w-4 h-4 fill-current" />
          <span>ATTEND BALLON D'OR & WORLD GALA</span>
        </button>
      </div>
    </div>
  );
};
