import React from 'react';
import { BallonDorResult, MediaVerdict } from '../data/awards';
import { Player } from '../types';
import { Trophy, Star, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface AwardsModalProps {
  player: Player;
  ballonDor: BallonDorResult;
  mediaVerdict: MediaVerdict;
  goldenShoeWon: boolean;
  onContinue: () => void;
}

export const AwardsModal: React.FC<AwardsModalProps> = ({
  player,
  ballonDor,
  mediaVerdict,
  goldenShoeWon,
  onContinue
}) => {
  const handleContinueClick = () => {
    sound.playTap();
    onContinue();
  };

  const topList = ballonDor.top10 || [];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#F1C40F]/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-[#F1C40F]/20 border border-[#F1C40F]/50 text-[#F1C40F] mb-1">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-[#F1C40F] uppercase tracking-wider">
            BALLON D'OR & WORLD GALA
          </h2>
          <p className="text-xs text-white/50 font-mono">Year {player.year} Global Football Awards Ceremony</p>
        </div>

        {/* 👑 BALLON D'OR ANNOUNCEMENT */}
        <div className="bg-[#2A2A2A] p-4 rounded-xl border border-[#F1C40F]/40 text-center space-y-2">
          <div className="text-[9px] font-black uppercase text-[#F1C40F] tracking-widest">
            OFFICIAL WINNER
          </div>
          <div className="text-lg font-black text-white flex items-center justify-center space-x-2">
            <span>{ballonDor.winner.name}</span>
            {ballonDor.isUserWinner && <span className="text-[10px] bg-[#F1C40F] text-black font-black px-2 py-0.5 rounded uppercase">YOU!</span>}
          </div>
          <div className="text-xs text-white/50 italic font-serif">{ballonDor.winner.club} • Score: {Math.round(ballonDor.winner.score)} pts</div>

          {!ballonDor.isUserWinner && (
            <div className="text-xs text-[#F1C40F] font-semibold pt-1 border-t border-white/5 mt-2">
              {ballonDor.userRank ? (
                <span>You finished Ranked <strong className="text-white">#{ballonDor.userRank}</strong> in world voting ({ballonDor.userPoints} pts)!</span>
              ) : (
                <span className="text-white/60">Unnominated for Ballon d'Or (Requires 78+ OVR or Top Division Dominance).</span>
              )}
            </div>
          )}
        </div>

        {/* 🥇 TOP 10 FINALISTS STANDINGS */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-black uppercase text-white/40 tracking-widest px-1">
            <span>BALLON D'OR TOP 10 RANKINGS</span>
            <span>VOTING POINTS</span>
          </div>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {topList.map((contender, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  contender.isUser 
                    ? 'bg-[#F1C40F]/20 border-[#F1C40F] text-[#F1C40F] font-bold shadow-[0_0_10px_rgba(241,196,15,0.2)]' 
                    : 'bg-[#2A2A2A] border-white/5 text-white/80'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`font-mono font-black text-[11px] w-5 text-center shrink-0 ${
                    idx === 0 ? 'text-[#F1C40F]' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-white/30'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-white">{contender.name}</span>
                    <span className="text-[10px] text-white/40 ml-1.5">({contender.club})</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-white/50 text-[11px] shrink-0 ml-2">{Math.round(contender.score)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🌟 YOUTH & DEVELOPMENT AWARDS */}
        {ballonDor.youthAwards && ballonDor.youthAwards.length > 0 && (
          <div className="bg-[#2A2A2A] p-3 rounded-xl border border-[#3498DB]/40 space-y-2">
            <div className="text-[9px] font-black uppercase text-[#3498DB] tracking-widest flex items-center space-x-1.5">
              <Star className="w-3 h-3" />
              <span>YOUTH & DEVELOPMENT HONOURS</span>
            </div>
            <div className="space-y-1.5">
              {ballonDor.youthAwards.map((yAward, idx) => (
                <div key={idx} className="bg-[#1E1E1E] p-2 rounded-lg border border-white/5 text-xs flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#3498DB] shrink-0" />
                  <div>
                    <div className="font-bold text-[#3498DB] text-[11px]">{yAward.title}</div>
                    <div className="text-[10px] text-white/60">{yAward.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 👞 GOLDEN SHOE */}
        {goldenShoeWon && (
          <div className="bg-[#F1C40F]/10 border border-[#F1C40F]/30 p-3 rounded-xl flex items-center space-x-3 text-xs">
            <Award className="w-6 h-6 text-[#F1C40F] shrink-0" />
            <div>
              <div className="font-bold text-[#F1C40F]">European Golden Shoe Winner!</div>
              <div className="text-[10px] text-white/50">Awarded for top goalscorer across European first divisions!</div>
            </div>
          </div>
        )}

        {/* 📈 MEDIA VERDICT */}
        <div className="bg-[#2A2A2A] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">MEDIA VERDICT</span>
            <span className="font-bold px-2 py-0.5 rounded text-[10px]" style={{ color: mediaVerdict.color, backgroundColor: `${mediaVerdict.color}22` }}>
              {mediaVerdict.status}
            </span>
          </div>
          <p className="text-white/80 text-[11px] leading-relaxed">{mediaVerdict.text}</p>
        </div>

        <button
          onClick={handleContinueClick}
          className="w-full bg-[#F1C40F] hover:bg-[#f39c12] text-black font-black text-xs py-3.5 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer shadow-[0_5px_15px_rgba(241,196,15,0.2)]"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>PROCEED TO TRANSFER WINDOW</span>
        </button>
      </div>
    </div>
  );
};
