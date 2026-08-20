import React, { useState } from 'react';
import { Player, Position } from '../types';
import { LEGEND_PLAYERS, LegendPlayerProfile } from '../data/legendPlayers';
import { Crown, Search, ChevronRight, X, Trophy, Star, Shield } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatOvr } from '../utils/format';
import { generateHiddenTraits, rollCareerCeiling } from '../utils/quickfireEngine';

interface LegendPlayerSelectModalProps {
  onSelectLegend: (player: Player) => void;
  onClose: () => void;
}

export const LegendPlayerSelectModal: React.FC<LegendPlayerSelectModalProps> = ({
  onSelectLegend,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<string>('ALL');
  const [activeLegend, setActiveLegend] = useState<LegendPlayerProfile>(LEGEND_PLAYERS[0]);

  const filteredLegends = LEGEND_PLAYERS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.startingClub.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = selectedPos === 'ALL' || p.position === selectedPos;
    return matchesSearch && matchesPos;
  });

  const handleConfirmSelect = () => {
    sound.playSuccess();
    const parts = activeLegend.name.split(' ');
    const firstName = parts[0] || activeLegend.firstName;
    const lastName = parts.slice(1).join(' ') || activeLegend.lastName;

    const newPlayer: Player = {
      id: `legend_${activeLegend.id}_${Date.now()}`,
      firstName,
      lastName,
      name: activeLegend.name,
      nationality: activeLegend.nationality,
      position: activeLegend.position,
      age: activeLegend.startingAge,
      ovr: activeLegend.startingOvr,
      mediaPot: activeLegend.mediaPot,
      club: activeLegend.startingClub,
      clubColor: '#1A365D', // Default iconic color
      clubSecondaryColor: '#CBD5E1',
      year: activeLegend.startingSeason,
      generation: 1,
      traits: [{ id: 'legend_aura', name: '👑 Iconic Legend', description: '+3 career prestige & growth momentum', color: '#F1C40F' }],
      history: [],
      totalApps: 0,
      totalGoals: 0,
      totalAssists: 0,
      totalTrophies: 0,
      avgRatingSum: 0,
      intCaps: 0,
      intGoals: 0,
      intAssists: 0,
      intTrophies: [],
      isCaptain: false,
      motmAwards: 0,
      goldenShoesWon: 0,
      ballonDorsWon: 0,
      hiddenTraits: generateHiddenTraits(),
      careerCeiling: rollCareerCeiling(),
      // Legend Mode specific flags & baseline
      gameMode: 'LEGEND',
      // @ts-ignore
      isLegendMode: true,
      // @ts-ignore
      realBaseline: activeLegend.realBaseline
    };

    onSelectLegend(newPlayer);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-purple-500/40 rounded-2xl w-full max-w-2xl p-5 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 mb-1">
            <Crown className="w-7 h-7 fill-purple-500/20" />
          </div>
          <h2 className="text-lg font-black text-purple-400 uppercase tracking-wider">
            SELECT A LEGENDARY CAREER
          </h2>
          <p className="text-xs text-white/60">
            Choose a footballing icon to take control of. Rewrite their destiny from their breakout season.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search legend, club, nationality..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
            />
          </div>
          <select
            value={selectedPos}
            onChange={e => setSelectedPos(e.target.value)}
            className="bg-[#2A2A2A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-purple-400 font-mono"
          >
            <option value="ALL">All Positions</option>
            <option value="ST">ST</option>
            <option value="LW">LW</option>
            <option value="RW">RW</option>
            <option value="CAM">CAM</option>
          </select>
        </div>

        {/* Layout: List on Left, Active Legend Preview on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Legend Roster List */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {filteredLegends.map(legend => {
              const isSelected = activeLegend.id === legend.id;
              return (
                <div
                  key={legend.id}
                  onClick={() => {
                    sound.playTap();
                    setActiveLegend(legend);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-400 shadow-md'
                      : 'bg-[#2A2A2A] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1E1E1E] border border-white/10 flex items-center justify-center font-black font-mono text-xs text-purple-300">
                      {formatOvr(legend.startingOvr)}
                    </div>
                    <div>
                      <div className="font-bold text-white font-serif italic text-sm">{legend.name}</div>
                      <div className="text-[10px] text-white/50">
                        {legend.startingClub} • Age {legend.startingAge} • <strong className="text-purple-300">{legend.position}</strong>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-white/20'}`} />
                </div>
              );
            })}
          </div>

          {/* Active Legend Baseline Preview Card */}
          <div className="bg-[#2A2A2A] border border-purple-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <h3 className="font-black text-white text-base font-serif italic">{activeLegend.name}</h3>
                  <p className="text-[10px] text-purple-300 font-mono">
                    Starting {activeLegend.startingSeason} • Age {activeLegend.startingAge} • {activeLegend.nationality}
                  </p>
                </div>
                <div className="text-right bg-[#1E1E1E] px-2.5 py-1 rounded-lg border border-white/10">
                  <div className="text-lg font-black font-mono text-purple-400">{formatOvr(activeLegend.startingOvr)}</div>
                  <div className="text-[8px] text-white/40 uppercase font-bold">OVR</div>
                </div>
              </div>

              <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/5 space-y-2">
                <div className="text-[9px] font-black uppercase tracking-wider text-white/50 flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Real Career Baseline (Historical Target)</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed italic font-serif">
                  "{activeLegend.realBaseline.historicalSummary}"
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-[#2A2A2A] p-1.5 rounded border border-white/5">
                    <span className="text-[9px] text-white/40 block">Real Goals</span>
                    <span className="font-bold text-[#2ECC71]">{activeLegend.realBaseline.careerGoals}</span>
                  </div>
                  <div className="bg-[#2A2A2A] p-1.5 rounded border border-white/5">
                    <span className="text-[9px] text-white/40 block">Real Trophies</span>
                    <span className="font-bold text-amber-400">{activeLegend.realBaseline.careerTrophies}</span>
                  </div>
                  <div className="bg-[#2A2A2A] p-1.5 rounded border border-white/5">
                    <span className="text-[9px] text-white/40 block">Real Caps</span>
                    <span className="font-bold text-cyan-300">{activeLegend.realBaseline.careerCaps}</span>
                  </div>
                  <div className="bg-[#2A2A2A] p-1.5 rounded border border-white/5">
                    <span className="text-[9px] text-white/40 block">Peak Value</span>
                    <span className="font-bold text-purple-300">{activeLegend.realBaseline.peakMarketValue}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmSelect}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3 rounded-xl shadow-lg uppercase tracking-wider cursor-pointer transition-transform active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>START LEGEND CAREER ({activeLegend.name})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
