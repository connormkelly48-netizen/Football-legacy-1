import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, CheckCircle2, ShieldCheck, Sparkles, Check, ShoppingBag, Loader2 } from 'lucide-react';
import { SUPPORT_TIERS, SupportTier } from '../config/billing';
import { googlePlayBilling } from '../utils/googlePlayBilling';
import { sound } from '../utils/audio';

interface SupportDevelopmentPageProps {
  onBack: () => void;
  onBadgeChanged?: () => void;
}

export const SupportDevelopmentPage: React.FC<SupportDevelopmentPageProps> = ({ onBack, onBadgeChanged }) => {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [purchasingTierId, setPurchasingTierId] = useState<string | null>(null);
  const [thankYouTier, setThankYouTier] = useState<SupportTier | null>(null);

  useEffect(() => {
    refreshBadgeData();
  }, []);

  const refreshBadgeData = () => {
    setUnlockedBadges(googlePlayBilling.getUnlockedBadges());
    setActiveBadge(googlePlayBilling.getActiveBadge());
    if (onBadgeChanged) onBadgeChanged();
  };

  const handlePurchase = async (tier: SupportTier) => {
    sound.playTap();
    setPurchasingTierId(tier.id);

    try {
      const result = await googlePlayBilling.requestPurchase(tier);
      if (result.success && result.tier) {
        sound.playSuccess();
        refreshBadgeData();
        setThankYouTier(result.tier);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasingTierId(null);
    }
  };

  const handleEquipBadge = (badge: string) => {
    sound.playTap();
    const newBadge = activeBadge === badge ? null : badge;
    googlePlayBilling.setActiveBadge(newBadge);
    setActiveBadge(newBadge);
    if (onBadgeChanged) onBadgeChanged();
  };

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => {
          sound.playTap();
          onBack();
        }}
        className="flex items-center space-x-2 text-xs font-bold text-white/70 hover:text-white bg-[#2A2A2A] hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Settings</span>
      </button>

      {/* Main Container */}
      <div className="bg-[#2A2A2A] rounded-2xl p-5 border border-white/10 space-y-5 shadow-xl">
        {/* Header section */}
        <div className="text-center space-y-2 pt-1 pb-3 border-b border-white/5">
          <div className="w-12 h-12 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/30 flex items-center justify-center mx-auto text-[#2ECC71]">
            <Heart className="w-6 h-6 fill-[#2ECC71]/20" />
          </div>
          <h2 className="text-xl font-black text-white font-serif tracking-tight">
            Support Football Legacy
          </h2>
        </div>

        {/* Description section */}
        <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5 space-y-3 text-xs leading-relaxed text-white/80">
          <p className="font-semibold text-white">Thank you for playing Football Legacy.</p>
          <p>
            Football Legacy is an independently developed game that continues to grow through regular updates, new features, balancing improvements and community feedback.
          </p>
          <p>
            If you've enjoyed the game and would like to support its continued development, you can do so through the optional support purchases below.
          </p>
          <p className="text-white/60 italic pt-1 border-t border-white/5 mt-2">
            These purchases are completely optional and provide no gameplay advantages. Every contribution helps fund future updates and improvements.
          </p>
        </div>

        {/* Active Cosmetic Badge Selector (If user has unlocked any) */}
        {unlockedBadges.length > 0 && (
          <div className="bg-[#1E1E1E] p-3.5 rounded-xl border border-[#2ECC71]/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#2ECC71]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2ECC71]">
                  Cosmetic Profile Badges
                </span>
              </div>
              <span className="text-[10px] text-white/50">
                {activeBadge ? `Active: ${activeBadge}` : 'No badge equipped'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {SUPPORT_TIERS.filter((t) => unlockedBadges.includes(t.id)).map((tier) => {
                const isEquipped = activeBadge === tier.badge;
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleEquipBadge(tier.badge)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isEquipped
                        ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71] shadow-sm'
                        : 'bg-[#2A2A2A] border-white/10 text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tier.badge}</span>
                    {isEquipped && <Check className="w-3.5 h-3.5 text-[#2ECC71]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Google Play Support Purchases */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/70 flex items-center space-x-2">
              <ShoppingBag className="w-3.5 h-3.5 text-[#2ECC71]" />
              <span>Google Play Support Options</span>
            </h3>
            <span className="text-[10px] text-white/40">Official Google Play Billing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUPPORT_TIERS.map((tier) => {
              const isUnlocked = unlockedBadges.includes(tier.id);
              const isLoading = purchasingTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`bg-[#1E1E1E] p-3.5 rounded-xl border ${tier.borderColor} space-y-3 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base">{tier.icon}</span>
                        <span className="font-extrabold text-sm text-white">{tier.title}</span>
                      </div>
                      <div className="text-[10px] text-white/50 mt-1 flex items-center space-x-1">
                        <span>Unlocks cosmetic badge:</span>
                        <span className="font-bold text-white/80">{tier.badge}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#2ECC71] font-mono bg-[#2ECC71]/10 px-2 py-0.5 rounded border border-[#2ECC71]/20">
                        {tier.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(tier)}
                    disabled={isLoading}
                    className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30'
                        : 'bg-[#2ECC71] hover:bg-[#27ae60] text-black shadow-md active:scale-[0.99]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting to Google Play...</span>
                      </>
                    ) : isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2ECC71]" />
                        <span>Support Again ({tier.price})</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-black" />
                        <span>Support — {tier.price}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recognition Footer Message */}
        <div className="bg-[#1E1E1E]/60 p-3.5 rounded-xl border border-white/5 text-center space-y-1.5 pt-3">
          <div className="flex items-center justify-center space-x-1.5 text-white/50 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span className="font-semibold text-white/70">Every donation is completely optional.</span>
          </div>
          <p className="text-[11px] text-white/60 font-medium">
            Football Legacy will never become pay-to-win.
          </p>
          <p className="text-[10px] text-white/40 pt-1 border-t border-white/5 mt-2">
            Thank you for supporting independent game development.
          </p>
        </div>
      </div>

      {/* Thank You Modal */}
      {thankYouTier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A2A2A] border border-[#2ECC71]/40 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71] flex items-center justify-center mx-auto text-[#2ECC71]">
              <Heart className="w-8 h-8 fill-[#2ECC71]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white font-serif">
                Thank You for Supporting Football Legacy!
              </h3>
              <p className="text-xs text-[#2ECC71] font-bold">
                Cosmetic Badge Unlocked: {thankYouTier.badge}
              </p>
            </div>

            <p className="text-xs text-white/80 leading-relaxed bg-[#1E1E1E] p-3 rounded-xl border border-white/5">
              Your contribution helps fund future updates, bug fixes and new features. We truly appreciate your support.
            </p>

            <button
              onClick={() => {
                sound.playTap();
                setThankYouTier(null);
              }}
              className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
