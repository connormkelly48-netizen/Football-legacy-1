import React from 'react';
import { RandomEvent, Player } from '../types';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface RandomEventModalProps {
  event: RandomEvent;
  player: Player;
  onResolve: (result: { ovrDelta: number; legacyBonus: number; text: string; forceHigherOffers?: boolean }) => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({
  event,
  player,
  onResolve
}) => {
  const handleAutoContinue = () => {
    sound.playTap();
    if (event.execute) {
      const res = event.execute(player);
      onResolve(res);
    } else {
      onResolve({ ovrDelta: 0, legacyBonus: 0, text: "Event resolved." });
    }
  };

  const handleChoiceSelect = (choiceIndex: number) => {
    sound.playSuccess();
    if (event.choices && event.choices[choiceIndex]) {
      const res = event.choices[choiceIndex].resolve(player);
      onResolve(res);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#F1C40F]/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl">
        <div className="flex items-center space-x-2 text-[#F1C40F]">
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F1C40F]">SEASON RANDOM EVENT</span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white">{event.title}</h3>
          <p className="text-xs text-white/70 mt-2 leading-relaxed">
            {event.description || "An event occurred during your season that impacted your development."}
          </p>
        </div>

        {event.isInteractive && event.choices ? (
          <div className="space-y-2 pt-2">
            {event.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoiceSelect(idx)}
                className="w-full bg-[#2A2A2A] hover:bg-[#2A2A2A]/80 p-3 rounded-xl border border-white/5 hover:border-[#2ECC71] text-left transition-all space-y-1 group cursor-pointer"
              >
                <div className="font-bold text-xs text-white group-hover:text-[#2ECC71] flex items-center justify-between">
                  <span>{choice.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#2ECC71]" />
                </div>
                <p className="text-[11px] text-white/50">{choice.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="pt-2">
            <button
              onClick={handleAutoContinue}
              className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-3 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>CONTINUE SEASON</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
