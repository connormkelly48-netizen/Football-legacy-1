import React, { useState } from 'react';
import { Player, TimelineEntry } from '../types';
import { Globe, Award, History, Clock } from 'lucide-react';
import { formatOvr } from '../utils/format';

interface CareerTabProps {
  player: Player;
  timelineFeed: TimelineEntry[];
}

export const CareerTab: React.FC<CareerTabProps> = ({ player, timelineFeed }) => {
  const [subTab, setSubTab] = useState<'stats' | 'timeline' | 'history'>('stats');

  const avgRating = player.history.length > 0 
    ? (player.avgRatingSum / player.history.length).toFixed(2)
    : '7.10';

  return (
    <div className="space-y-4">
      {/* Sub-navigation controls */}
      <div className="grid grid-cols-3 gap-1 bg-[#1E1E1E] p-1 rounded-xl border border-white/5 text-xs">
        <button
          onClick={() => setSubTab('stats')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-colors ${
            subTab === 'stats' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          Stats & Int.
        </button>
        <button
          onClick={() => setSubTab('timeline')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-colors ${
            subTab === 'timeline' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          Timeline ({timelineFeed.length})
        </button>
        <button
          onClick={() => setSubTab('history')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-colors ${
            subTab === 'history' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          Seasons
        </button>
      </div>

      {subTab === 'stats' && (
        <div className="space-y-4">
          {/* ⚽ CLUB CAREER TOTALS */}
          <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Award className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
                CLUB CAREER TOTALS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Apps</div>
                <div className="text-base font-black font-mono text-white mt-0.5">{player.totalApps}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Goals</div>
                <div className="text-base font-black font-mono text-[#2ECC71] mt-0.5">{player.totalGoals}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Assists</div>
                <div className="text-base font-black font-mono text-cyan-400 mt-0.5">{player.totalAssists}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Avg Rating</div>
                <div className="text-base font-black font-mono text-[#F1C40F] mt-0.5">{avgRating}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Trophies</div>
                <div className="text-sm font-bold font-mono text-[#F1C40F]">{player.totalTrophies}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Ballon d'Ors</div>
                <div className="text-sm font-bold font-mono text-[#F1C40F]">{player.ballonDorsWon}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Golden Shoes</div>
                <div className="text-sm font-bold font-mono text-[#F1C40F]">{player.goldenShoesWon}</div>
              </div>
            </div>
          </div>

          {/* 🌐 INTERNATIONAL CAREER */}
          <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                  INTERNATIONAL CAREER ({player.nationality.toUpperCase()})
                </span>
              </div>
              {player.isCaptain && (
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#F1C40F]/20 text-[#F1C40F] border border-[#F1C40F]/40">
                  CAPTAIN 👑
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Caps</div>
                <div className="text-base font-black font-mono text-white mt-0.5">{player.intCaps}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Int. Goals</div>
                <div className="text-base font-black font-mono text-cyan-400 mt-0.5">{player.intGoals}</div>
              </div>
              <div className="bg-[#1E1E1E] p-2.5 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-white/40">Int. Honors</div>
                <div className="text-base font-black font-mono text-[#F1C40F] mt-0.5">{player.intTrophies ? player.intTrophies.length : 0}</div>
              </div>
            </div>

            {player.intTrophies && player.intTrophies.length > 0 && (
              <div className="text-xs pt-1">
                <span className="text-white/40 block mb-1 text-[9px] uppercase font-bold">Trophies Won:</span>
                <div className="flex flex-wrap gap-1">
                  {player.intTrophies.map((t, idx) => (
                    <span key={idx} className="bg-[#F1C40F]/10 text-[#F1C40F] border border-[#F1C40F]/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                      🏆 {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'timeline' && (
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
            <Clock className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
              CAREER CHRONOLOGICAL FEED
            </span>
          </div>

          {timelineFeed.length === 0 ? (
            <div className="text-center py-6 text-white/40 text-xs italic">
              No milestone entries recorded yet. Sim a season to start your timeline!
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {timelineFeed.map(entry => (
                <div
                  key={entry.id}
                  className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 flex items-start space-x-3 text-xs"
                >
                  <div className="text-base shrink-0 p-1.5 bg-[#2A2A2A] rounded-lg border border-white/5">{entry.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">{entry.title}</span>
                      <span className="text-[10px] text-white/40 font-mono ml-2 shrink-0">{entry.year} (Age {entry.age})</span>
                    </div>
                    <p className="text-white/60 text-[11px] mt-0.5 leading-snug">{entry.description}</p>
                    <div className="text-[10px] text-[#2ECC71] mt-1 font-semibold uppercase tracking-wider">
                      {entry.playerName} • {entry.club}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'history' && (
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
            <History className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
              SEASON BY SEASON RECORD
            </span>
          </div>

          {player.history.length === 0 ? (
            <div className="text-center py-6 text-white/40 text-xs italic">
              No season history recorded yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {player.history.slice().reverse().map((s, idx) => (
                <div key={idx} className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5">
                    <span className="font-bold text-[#F1C40F] font-mono">{s.year} (Age {s.age})</span>
                    <span className="font-bold text-white italic font-serif">{s.club}</span>
                    <span className="text-[10px] text-[#2ECC71] font-mono font-bold">{formatOvr(s.oldOvr)} ➔ {formatOvr(s.newOvr)} OVR</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-white/50 font-mono">
                    <div>Apps: <span className="text-white font-bold">{s.apps}</span></div>
                    <div>Goals: <span className="text-[#2ECC71] font-bold">{s.goals}</span></div>
                    <div>Assists: <span className="text-cyan-400 font-bold">{s.assists}</span></div>
                    <div>Rating: <span className="text-[#F1C40F] font-bold">{s.rating}</span></div>
                  </div>
                  {s.trophiesWon && s.trophiesWon.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {s.trophiesWon.map((t, ti) => (
                        <div key={ti} className="text-[10px] text-[#F1C40F] font-semibold bg-[#F1C40F]/10 px-2 py-0.5 rounded border border-[#F1C40F]/20">
                          🏆 {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
