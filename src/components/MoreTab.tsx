import React, { useState } from 'react';
import { Player, SaveSlot, Ancestor, TimelineEntry, WorldHeadlinePackage, League } from '../types';
import { Save, Download, Volume2, VolumeX, RotateCcw, ShieldAlert, Sparkles, Check, Home, Heart, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { SupportDevelopmentPage } from './SupportDevelopmentPage';

interface MoreTabProps {
  player: Player | null;
  legacyTree: Ancestor[];
  legacyScore: number;
  currentGen: number;
  timeline: TimelineEntry[];
  newsFeed: WorldHeadlinePackage[];
  leagues: League[];
  onLoadSave: (slot: SaveSlot) => void;
  onResetData: () => void;
  onReturnToMainMenu: () => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  player,
  legacyTree,
  legacyScore,
  currentGen,
  timeline,
  newsFeed,
  leagues,
  onLoadSave,
  onResetData,
  onReturnToMainMenu
}) => {
  const [view, setView] = useState<'settings' | 'support'>('settings');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(sound.enabled);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showMainMenuConfirm, setShowMainMenuConfirm] = useState<boolean>(false);

  const getSavedSlots = (): (SaveSlot | null)[] => {
    const slots: (SaveSlot | null)[] = [null, null, null];
    for (let i = 1; i <= 3; i++) {
      const raw = localStorage.getItem(`football_legacy_save_slot_${i}`);
      if (raw) {
        try {
          slots[i - 1] = JSON.parse(raw);
        } catch {
          // ignore corrupted
        }
      }
    }
    return slots;
  };

  const [slots, setSlots] = useState<(SaveSlot | null)[]>(getSavedSlots());

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    sound.enabled = next;
    setAudioEnabled(next);
    if (next) sound.playTap();
  };

  const handleSaveToSlot = (slotNum: number) => {
    if (!player) return;
    sound.playSuccess();

    const saveObj: SaveSlot = {
      id: slotNum,
      saveName: `${player.name} (Gen ${currentGen})`,
      dateSaved: new Date().toLocaleDateString(),
      player,
      legacyTree,
      legacyScore,
      currentGeneration: currentGen,
      timeline,
      newsFeed,
      dynamicLeagues: leagues
    };

    localStorage.setItem(`football_legacy_save_slot_${slotNum}`, JSON.stringify(saveObj));
    setSlots(getSavedSlots());
    setSaveSuccessMsg(`Dynasty saved to Slot ${slotNum}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLoadFromSlot = (slot: SaveSlot) => {
    sound.playTap();
    onLoadSave(slot);
    setSaveSuccessMsg(`Loaded save: ${slot.saveName}`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  if (view === 'support') {
    return <SupportDevelopmentPage onBack={() => setView('settings')} />;
  }

  return (
    <div className="space-y-4">
      {/* 💖 SUPPORT DEVELOPMENT */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <Heart className="w-4 h-4 text-[#2ECC71]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
            COMMUNITY & SUPPORT
          </span>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setView('support');
          }}
          className="w-full bg-[#1E1E1E] hover:bg-white/10 p-3.5 rounded-xl border border-white/5 flex items-center justify-between text-left cursor-pointer transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 flex items-center justify-center text-[#2ECC71]">
              <Heart className="w-4 h-4 fill-[#2ECC71]/20" />
            </div>
            <div>
              <div className="font-bold text-xs text-white group-hover:text-[#2ECC71] transition-colors">
                Support Development
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">
                Help fund future updates, features & leagues
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* 💾 SAVE & LOAD MANAGER */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <Save className="w-4 h-4 text-[#2ECC71]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
            SAVE & LOAD SLOTS
          </span>
        </div>

        {saveSuccessMsg && (
          <div className="bg-[#2ECC71]/20 border border-[#2ECC71]/40 text-[#2ECC71] p-2.5 rounded-xl text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="space-y-2">
          {slots.map((slot, index) => {
            const slotNum = index + 1;
            return (
              <div
                key={slotNum}
                className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    <span>SLOT {slotNum}</span>
                    {slot && <span className="text-[10px] text-[#F1C40F] font-semibold font-mono">• {slot.saveName}</span>}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5 font-mono">
                    {slot ? `Saved on ${slot.dateSaved} • ${slot.legacyScore.toLocaleString()} Legacy Pts` : 'Empty Slot'}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSaveToSlot(slotNum)}
                    disabled={!player}
                    className="px-3 py-1.5 rounded-lg bg-[#2ECC71]/20 hover:bg-[#2ECC71]/30 text-[#2ECC71] font-bold border border-[#2ECC71]/30 disabled:opacity-40 uppercase text-[10px] tracking-wider cursor-pointer"
                  >
                    Save
                  </button>
                  {slot && (
                    <button
                      onClick={() => handleLoadFromSlot(slot)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 inline" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ⚙️ GAME SETTINGS */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <Sparkles className="w-4 h-4 text-[#F1C40F]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F1C40F]">
            AUDIO & GAME SETTINGS
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-xl border border-white/5 text-xs">
          <div>
            <div className="font-bold text-white">Audio & Sound FX</div>
            <div className="text-[10px] text-white/40">Web Audio API synthesized sound feedback</div>
          </div>
          <button
            onClick={handleToggleAudio}
            className={`p-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
              audioEnabled ? 'bg-[#2ECC71] text-black' : 'bg-[#2A2A2A] text-white/40 border border-white/5'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Return to Main Menu Option */}
        <div className="pt-2 border-t border-white/5">
          <button
            onClick={() => setShowMainMenuConfirm(true)}
            className="w-full bg-[#1E1E1E] hover:bg-white/10 text-white font-bold text-xs py-3 rounded-xl border border-white/10 flex items-center justify-center space-x-2 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4 text-[#2ECC71]" />
            <span>RETURN TO MAIN MENU</span>
          </button>
        </div>
      </div>

      {/* RETURN TO MAIN MENU CONFIRMATION MODAL */}
      {showMainMenuConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2A2A2A] border border-white/10 rounded-2xl max-w-sm w-full p-5 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/40 flex items-center justify-center mx-auto text-[#2ECC71]">
              <Home className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-white font-serif">Return to Main Menu?</h3>
              <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                Your career will be automatically saved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowMainMenuConfirm(false)}
                className="bg-[#1E1E1E] hover:bg-white/10 text-white/80 font-bold text-xs py-2.5 rounded-xl border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMainMenuConfirm(false);
                  sound.playSuccess();
                  onReturnToMainMenu();
                }}
                className="bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-2.5 rounded-xl shadow-lg cursor-pointer"
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 RESET DATA */}
      <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-rose-500/30 space-y-3 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">
            DANGER ZONE
          </span>
        </div>

        <button
          onClick={onResetData}
          className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="uppercase tracking-wider font-extrabold text-[11px]">RESET DYNASTY & START NEW CAREER</span>
        </button>
      </div>

      {/* CREDITS */}
      <div className="text-center text-[10px] text-white/40 pt-2 space-y-1 font-mono">
        <div>Football Legacy • v0.1</div>
        <div>Engineered for Mobile-First Generational Simulation</div>
      </div>
    </div>
  );
};
