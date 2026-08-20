import React, { useState } from 'react';
import { Crown, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { unlockLegendMode } from '../utils/legendBilling';

interface LegendPurchaseModalProps {
  onUnlocked: () => void;
  onClose: () => void;
}

export const LegendPurchaseModal: React.FC<LegendPurchaseModalProps> = ({
  onUnlocked,
  onClose
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handlePurchase = async () => {
    sound.playTap();
    setLoading(true);
    // Simulate Google Play Billing payment confirmation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    unlockLegendMode();
    setLoading(false);
    setSuccess(true);
    sound.playTrophyFanfare();

    setTimeout(() => {
      onUnlocked();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-purple-500/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex p-3 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 mb-1">
            <Crown className="w-8 h-8 fill-purple-500/20" />
          </div>
          <h2 className="text-lg font-black text-purple-400 uppercase tracking-wider">
            LEGEND MODE (DLC)
          </h2>
          <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
            Unlock Legend Mode to step into the boots of all-time football greats, rewrite history, and pit your simulated career against their real-world legacy baselines!
          </p>
        </div>

        {success ? (
          <div className="bg-[#2ECC71]/20 border border-[#2ECC71]/40 p-4 rounded-xl text-center space-y-2">
            <div className="inline-flex p-2 rounded-full bg-[#2ECC71] text-black">
              <Check className="w-5 h-5" />
            </div>
            <div className="font-black text-sm text-[#2ECC71]">DLC UNLOCKED SUCCESSFULLY!</div>
            <div className="text-xs text-white/70">Entering Legend Mode roster...</div>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="bg-[#2A2A2A] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-[#2ECC71] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>What's Included in Legend Mode:</span>
              </div>
              <ul className="space-y-1.5 text-white/80 pl-1">
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Select from 12+ iconic real player legends</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Preserve and simulate historical divergence paths</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>Exclusive Side-by-Side Legacy Comparison screen on retirement</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{loading ? 'PROCESSING PURCHASE...' : 'UNLOCK LEGEND MODE (€4.99)'}</span>
            </button>
            <div className="text-[10px] text-center text-white/40 font-mono">
              Google Play Secure Digital Goods Billing Simulation
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
