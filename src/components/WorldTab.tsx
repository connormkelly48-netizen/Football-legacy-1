import React, { useState } from 'react';
import { League, WorldHeadlinePackage, Player, Superstar, Club } from '../types';
import { Globe, TrendingUp, Newspaper, Trophy, Shield, Building, Network, Search, DollarSign, UserCheck } from 'lucide-react';
import { MULTI_CLUB_GROUPS } from '../data/database2026';
import { dynamicClubs } from '../data/world';
import { formatOvr } from '../utils/format';

interface WorldTabProps {
  player: Player;
  leagues: League[];
  newsFeed: WorldHeadlinePackage[];
  superstars?: Superstar[];
  clubs?: Club[];
}

export const WorldTab: React.FC<WorldTabProps> = ({ player, leagues, newsFeed, superstars = [], clubs = dynamicClubs }) => {
  const [subTab, setSubTab] = useState<'rankings' | 'clubs' | 'networks' | 'news' | 'superstars'>('rankings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');

  const activeStars = superstars.filter(s => !s.isRetired).sort((a, b) => b.ovr - a.ovr);
  const retiredStars = superstars.filter(s => s.isRetired).sort((a, b) => (b.retiredYear || 0) - (a.retiredYear || 0));

  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.owner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                          (c.stadium?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesLeague = selectedLeague === 'ALL' || c.leagueId === selectedLeague;
    return matchesSearch && matchesLeague;
  }).sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-4">
      {/* Sub-navigation controls */}
      <div className="grid grid-cols-5 gap-1 bg-[#1E1E1E] p-1 rounded-xl border border-white/5 text-xs overflow-x-auto">
        <button
          onClick={() => setSubTab('rankings')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[8px] sm:text-[9px] transition-colors whitespace-nowrap ${
            subTab === 'rankings' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          UEFA Rankings
        </button>
        <button
          onClick={() => setSubTab('clubs')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[8px] sm:text-[9px] transition-colors whitespace-nowrap ${
            subTab === 'clubs' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          Clubs & Owners
        </button>
        <button
          onClick={() => setSubTab('networks')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[8px] sm:text-[9px] transition-colors whitespace-nowrap ${
            subTab === 'networks' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          Multi-Club Networks
        </button>
        <button
          onClick={() => setSubTab('news')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[8px] sm:text-[9px] transition-colors whitespace-nowrap ${
            subTab === 'news' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          World News
        </button>
        <button
          onClick={() => setSubTab('superstars')}
          className={`py-2 rounded-lg font-bold uppercase tracking-wider text-[8px] sm:text-[9px] transition-colors whitespace-nowrap ${
            subTab === 'superstars' ? 'bg-[#2ECC71] text-black font-black' : 'text-white/40 hover:text-white'
          }`}
        >
          World Rivals
        </button>
      </div>

      {subTab === 'rankings' && (
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
            <TrendingUp className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
              DYNAMIC UEFA LEAGUE COEFFICIENTS
            </span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {leagues.map((league, idx) => (
              <div
                key={league.id}
                className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-white/30 text-xs w-5 text-right">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1.5 font-serif italic text-sm">
                      <span>{league.name}</span>
                      <span className="text-[10px] text-white/40 not-italic font-sans">({league.country})</span>
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5 font-sans">
                      Tier {league.tier} • {league.promotionTo ? `Promotes to ${league.promotionTo}` : 'Top Division'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black font-mono text-[#2ECC71]">{league.rep}</span>
                  <span className="text-[9px] font-bold text-white/40 block tracking-widest">REP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'clubs' && (
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
                WORLD CLUB DIRECTORY & OWNERSHIP
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search club, owner, stadium..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ECC71]"
                />
              </div>
              <select
                value={selectedLeague}
                onChange={e => setSelectedLeague(e.target.value)}
                className="bg-[#1E1E1E] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-[#2ECC71]"
              >
                <option value="ALL">All Leagues</option>
                {leagues.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.country})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {filteredClubs.map(c => (
              <div
                key={c.id}
                className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm border border-white/10 shadow-inner shrink-0"
                    style={{ backgroundColor: c.color, color: c.secondaryColor || '#FFFFFF' }}
                  >
                    {c.rating}
                  </div>
                  <div>
                    <div className="font-bold text-white font-serif italic text-sm flex items-center space-x-2">
                      <span>{c.name}</span>
                      {c.multiClubGroupId && (
                        <span className="text-[8px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase font-mono not-italic">
                          MULTI-CLUB
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5 space-x-2">
                      <span>🏟️ {c.stadium || 'Home Arena'}</span>
                      <span>•</span>
                      <span>Philosophy: <strong className="text-white/80">{c.philosophy?.replace(/_/g, ' ')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-white/40 font-mono">OWNER</div>
                    <div className="font-bold text-white/90 text-xs">{c.owner?.name || 'Board of Directors'}</div>
                    <div className="text-[9px] text-[#2ECC71] font-mono">
                      {c.owner?.personality.replace(/_/g, ' ')} • Spend {c.owner?.spendingPower}/10
                    </div>
                  </div>
                  <div className="text-right pl-3 border-l border-white/5">
                    <span className="text-xs font-mono font-bold text-[#F1C40F]">${c.finances || 70}M</span>
                    <span className="text-[8px] text-white/40 block font-mono">FINANCES</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'networks' && (
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-4 shadow-lg">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
            <Network className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
              GLOBAL MULTI-CLUB OWNERSHIP GROUPS
            </span>
          </div>

          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
            {MULTI_CLUB_GROUPS.map(group => {
              const groupMemberClubs = clubs.filter(c => group.clubIds.includes(c.id));

              return (
                <div key={group.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm font-serif italic">{group.name}</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {groupMemberClubs.length} Connected Sister Clubs across Global Leagues
                      </p>
                    </div>
                    <span className="text-[9px] bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30 font-mono px-2 py-1 rounded-lg uppercase">
                      NETWORK ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {groupMemberClubs.map(mClub => (
                      <div
                        key={mClub.id}
                        className="bg-[#2A2A2A] p-2.5 rounded-lg border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-xs shrink-0"
                            style={{ backgroundColor: mClub.color, color: mClub.secondaryColor || '#FFFFFF' }}
                          >
                            {mClub.rating}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{mClub.name}</div>
                            <div className="text-[9px] text-white/40">{mClub.stadium}</div>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono text-[#F1C40F] bg-white/5 px-2 py-0.5 rounded">
                          {mClub.owner?.personality.replace(/_/g, ' ') || 'NETWORK'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subTab === 'news' && (
        <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
            <Newspaper className="w-4 h-4 text-[#2ECC71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ECC71]">
              SEASONAL WORLD FOOTBALL HEADLINES
            </span>
          </div>

          {newsFeed.length === 0 ? (
            <div className="text-center py-6 text-white/40 text-xs italic">
              No world headlines generated yet. Complete a season to see global football developments!
            </div>
          ) : (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {newsFeed.map((pkg, idx) => (
                <div key={idx} className="bg-[#1E1E1E] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-bold text-[#F1C40F] font-mono text-[11px] tracking-wider">
                      YEAR {pkg.year} EDITION
                    </span>
                    <Globe className="w-3.5 h-3.5 text-white/30" />
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {pkg.headlines.map((line, hIdx) => (
                      <li key={hIdx} className="text-white/80 text-xs leading-snug flex items-start space-x-2">
                        <span className="text-[#2ECC71] shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'superstars' && (
        <div className="space-y-4">
          {/* Active Rivals */}
          <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-[#F1C40F]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#F1C40F]">
                  ACTIVE BALLON D'OR CONTENDERS
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40">{activeStars.length} Active</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {activeStars.map((star) => (
                <div
                  key={star.id}
                  className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2A2A2A] border border-white/10 flex items-center justify-center font-black font-mono text-xs text-[#2ECC71]">
                      {formatOvr(star.ovr)}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center space-x-2">
                        <span className="italic font-serif">{star.name}</span>
                        {star.isRegen && (
                          <span className="text-[9px] bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30 font-mono px-1.5 py-0.5 rounded uppercase">
                            REGEN
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {star.club} • {star.pos} • Age {star.age} {star.nationality ? `• ${star.nationality}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-[#F1C40F]">Peak {formatOvr(star.peakOvr)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retired Legends */}
          {retiredStars.length > 0 && (
            <div className="bg-[#2A2A2A] rounded-2xl p-4 border border-white/5 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <Shield className="w-4 h-4 text-white/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                  RETIRED WORLD LEGENDS
                </span>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {retiredStars.map((star) => (
                  <div
                    key={star.id}
                    className="bg-[#1E1E1E]/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs opacity-70"
                  >
                    <div>
                      <div className="font-bold text-white/80 italic font-serif line-through decoration-white/30">
                        {star.name}
                      </div>
                      <div className="text-[10px] text-white/40">
                        Retired at Age {star.age} ({star.retiredYear ? `Year ${star.retiredYear}` : ''}) • Last Club: {star.club}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white/40">Peak {formatOvr(star.peakOvr)} OVR</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

