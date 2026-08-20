import React, { useState } from 'react';
import { TransferOffer, Player } from '../types';
import { RefreshCw, CheckCircle, ArrowRightLeft, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

interface TransferModalProps {
  player: Player;
  offers: TransferOffer[];
  onSelectOffer: (offer: TransferOffer) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  player,
  offers,
  onSelectOffer
}) => {
  const [selectedOffer, setSelectedOffer] = useState<TransferOffer>(offers[0]);

  const handleConfirmMove = () => {
    sound.playSuccess();
    onSelectOffer(selectedOffer);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#2ECC71]/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/50 text-[#2ECC71] mb-1">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            TRANSFER WINDOW OFFERS
          </h2>
          {player.isTransferListed ? (
            <div className="bg-[#E74C3C]/20 border border-[#E74C3C]/50 text-[#E74C3C] px-3 py-1.5 rounded-lg text-xs font-bold my-1">
              ⚠️ TRANSFER LISTED: 6 Incoming Move Offers (No Re-sign Option)
            </div>
          ) : (
            <p className="text-xs text-white/50">
              Choose your contract for season {player.year + 1}. Select stay or transfer.
            </p>
          )}
        </div>

        {/* OFFERS SELECTION LIST */}
        <div className="space-y-2">
          {offers.map(offer => {
            const isSelected = selectedOffer.id === offer.id;
            return (
              <button
                key={offer.id}
                onClick={() => {
                  sound.playTap();
                  setSelectedOffer(offer);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all space-y-1.5 relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-[#2A2A2A] border-[#2ECC71] shadow-md ring-1 ring-[#2ECC71]'
                    : 'bg-[#2A2A2A]/60 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#2ECC71]" />
                    <span className="font-black text-white text-sm italic font-serif">{offer.club.name}</span>
                    {offer.type === 'SISTER_CLUB' && (
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                        SISTER NETWORK
                      </span>
                    )}
                    {offer.type === 'LOAN' && (
                      <span className="text-[9px] bg-[#F1C40F]/20 text-[#F1C40F] border border-[#F1C40F]/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                        LOAN — 1 YEAR
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#1E1E1E] text-[#2ECC71] border border-white/5">
                    {offer.club.rating} OVR
                  </span>
                </div>

                <p className="text-[11px] text-white/70 leading-tight">{offer.description}</p>

                <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
                  <span className="font-semibold text-[#F1C40F]">{offer.label}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-[#2ECC71]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* CONFIRM BUTTON */}
        <button
          onClick={handleConfirmMove}
          className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-3.5 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer mt-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>CONFIRM MOVE TO {selectedOffer.club.name.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
};
