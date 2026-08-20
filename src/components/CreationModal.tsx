import React, { useState } from 'react';
import { Position, StoryPreset, Player, GameMode } from '../types';
import { CLUBS_2026, LEAGUES_2026, getClubByName } from '../data/database2026';
import { UserPlus, Sparkles, ChevronRight, Dices, Flame, Shield } from 'lucide-react';
import { sound } from '../utils/audio';
import { generateHiddenTraits, rollCareerCeiling } from '../utils/quickfireEngine';

interface CreationModalProps {
  generation: number;
  fatherPlayer?: Player | null;
  onComplete: (newPlayer: Player) => void;
}

const NATIONS = [
  "England", "Spain", "Germany", "Italy", "France", "Portugal", "Netherlands",
  "Belgium", "Scotland", "Ireland", "Turkey", "Croatia", "Denmark", "Switzerland"
];

const POSITIONS: Position[] = ['ST', 'CAM', 'CM', 'CB', 'LB', 'RB', 'CDM', 'LM', 'RM', 'LW', 'RW', 'GK'];

const FIRST_NAMES_BY_NATION: Record<string, string[]> = {
  England: ["Jude", "Harry", "Liam", "Ethan", "Cole", "Declan", "Bukayo", "Archie", "Jack", "Marcus"],
  Spain: ["Lamine", "Pedro", "Gavi", "Marco", "Alejandro", "Pablo", "Hector", "Iker", "Ferran", "Rodri"],
  Germany: ["Florian", "Jamal", "Noah", "Leon", "Julian", "Lukas", "Maximilian", "Felix", "Kai", "Timo"],
  Italy: ["Sandro", "Marco", "Federico", "Nicolò", "Gianluca", "Davide", "Mateo", "Lorenzo", "Ciro"],
  France: ["Kylian", "Antoine", "Lucas", "Hugo", "Enzo", "Mathieu", "Rayane", "Aurélien", "Jules", "Eduardo"],
  Portugal: ["Rafael", "João", "Bernardo", "Gonçalo", "Diogo", "Vitinha", "Ruben", "Bruno", "Cristiano"],
  Netherlands: ["Cody", "Xavi", "Frenkie", "Virgil", "Ryan", "Sven", "Denzel", "Nathan", "Memphis"],
  Belgium: ["Kevin", "Romelu", "Youri", "Leandro", "Jeremy", "Amadou", "Arthur", "Loïs"],
  Scotland: ["Scott", "John", "Andy", "Kieran", "Billy", "Callum", "Lewis", "Che"],
  Ireland: ["Evan", "Caoimhin", "Nathan", "Troy", "Chiedozie", "Matt", "Josh", "Jason"],
  Turkey: ["Arda", "Hakan", "Orkun", "Kerem", "Barış", "Kenan", "Semih", "Cenk"],
  Croatia: ["Luka", "Joško", "Mateo", "Dominik", "Mario", "Ivan", "Andrej", "Josip"],
  Denmark: ["Rasmus", "Christian", "Pierre", "Joachim", "Mikkel", "Jesper", "Jonas"],
  Switzerland: ["Granit", "Manuel", "Breel", "Denis", "Yann", "Fabian", "Ruben"]
};

const LAST_NAMES_BY_NATION: Record<string, string[]> = {
  England: ["Smith", "Jones", "Walker", "Palmer", "Rice", "Alexander", "Kane", "Greenwood", "Bellingham", "Foden"],
  Spain: ["Garcia", "Torres", "Lopez", "Rodriguez", "Fernandez", "Gomez", "Ruiz", "Navarro", "Yamal", "Pedri"],
  Germany: ["Schmidt", "Weber", "Müller", "Hoffmann", "Schneider", "Fischer", "Wagner", "Becker", "Wirtz", "Musiala"],
  Italy: ["Rossi", "Moretti", "Bastoni", "Chiesa", "Barella", "Donnarumma", "Pellegrini", "Tonali", "Dimarco"],
  France: ["Dupont", "Mercier", "Moreau", "Laurent", "Giroud", "Camavinga", "Dubois", "Fontaine", "Mbappé", "Griezmann"],
  Portugal: ["Neves", "Silva", "Dias", "Felix", "Cancelo", "Fernandes", "Ramos", "Leão", "Jota"],
  Netherlands: ["de Jong", "Simons", "Gakpo", "van Dijk", "Gravenberch", "de Ligt", "Dumfries", "Aké"],
  Belgium: ["De Bruyne", "Lukaku", "Tielemans", "Trossard", "Doku", "Onana", "Theate"],
  Scotland: ["McTominay", "McGinn", "Robertson", "Tierney", "Gilmour", "McGregor", "Ferguson"],
  Ireland: ["Ferguson", "Kelleher", "Collins", "Parrott", "Ogbene", "Doherty", "Cullen"],
  Turkey: ["Güler", "Çalhanoğlu", "Kökçü", "Aktürkoğlu", "Yılmaz", "Yıldız", "Kılıçsoy"],
  Croatia: ["Modrić", "Gvardiol", "Kovačić", "Livaković", "Pašalić", "Perišić", "Kramarić"],
  Denmark: ["Højlund", "Eriksen", "Højbjerg", "Andersen", "Damsgaard", "Lindstrøm"],
  Switzerland: ["Xhaka", "Akanji", "Embolo", "Zakaria", "Sommer", "Rieder"]
};

const COUNTRIES = Array.from(new Set(LEAGUES_2026.map(l => l.country)));

// Module-level so they're available to lazy useState initializers below —
// previously these lived inside the component body, which meant the
// starting name had to be a hardcoded literal ('Leo Vance' every time)
// rather than actually randomized on mount.
const getRandomFirstName = (nation: string) => {
  const pool = FIRST_NAMES_BY_NATION[nation] || FIRST_NAMES_BY_NATION['England'];
  return pool[Math.floor(Math.random() * pool.length)];
};

const getRandomLastName = (nation: string) => {
  const pool = LAST_NAMES_BY_NATION[nation] || LAST_NAMES_BY_NATION['England'];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const CreationModal: React.FC<CreationModalProps> = ({
  generation,
  fatherPlayer,
  onComplete
}) => {
  const isChild = generation > 1 && fatherPlayer;
  const initialNationality = isChild ? fatherPlayer.nationality : 'England';

  // Randomized on every mount — previously hardcoded to 'Leo Vance' (or
  // 'Marcus' + father's surname for a child) as the starting preset, so
  // every new career opened with the same default name until the player
  // manually hit the dice button. A child still inherits the father's
  // actual surname (that's the legacy/family feature, not a bug) — only
  // the first name randomizes in that case.
  const [firstName, setFirstName] = useState(() => getRandomFirstName(initialNationality));
  const [lastName, setLastName] = useState(() => isChild ? fatherPlayer.lastName : getRandomLastName(initialNationality));
  const [nationality, setNationality] = useState(initialNationality);
  const [position, setPosition] = useState<Position>('ST');
  const [storyPreset, setStoryPreset] = useState<StoryPreset>('wonderkid');

  // Custom age & custom OVR state (used when preset === 'custom')
  const [customAge, setCustomAge] = useState<number>(18);
  const [customOvr, setCustomOvr] = useState<number>(65);

  // Cascading Country -> League -> Club
  const [selectedCountry, setSelectedCountry] = useState<string>('England');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('ENG_PREM');
  const [selectedClubName, setSelectedClubName] = useState<string>('Manchester City');

  // Helper functions for cascading dropdowns
  const availableLeagues = LEAGUES_2026.filter(l => l.country === selectedCountry);
  const availableClubs = CLUBS_2026.filter(c => c.leagueId === selectedLeagueId);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const leagues = LEAGUES_2026.filter(l => l.country === country);
    if (leagues.length > 0) {
      const firstLeague = leagues[0];
      setSelectedLeagueId(firstLeague.id);
      const clubs = CLUBS_2026.filter(c => c.leagueId === firstLeague.id);
      if (clubs.length > 0) {
        setSelectedClubName(clubs[0].name);
      }
    }
  };

  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    const clubs = CLUBS_2026.filter(c => c.leagueId === leagueId);
    if (clubs.length > 0) {
      setSelectedClubName(clubs[0].name);
    }
  };

  // --- Randomise Handlers ---
  const handleRandomName = () => {
    sound.playTap();
    setFirstName(getRandomFirstName(nationality));
    setLastName(getRandomLastName(nationality));
  };

  const handleRandomNation = () => {
    sound.playTap();
    const randomNation = NATIONS[Math.floor(Math.random() * NATIONS.length)];
    setNationality(randomNation);
  };

  const handleRandomPosition = () => {
    sound.playTap();
    setPosition(POSITIONS[Math.floor(Math.random() * POSITIONS.length)]);
  };

  const handleRandomPreset = () => {
    sound.playTap();
    const presets: StoryPreset[] = ['wonderkid', 'standard', 'late', 'custom'];
    const p = presets[Math.floor(Math.random() * presets.length)];
    setStoryPreset(p);
    if (p === 'custom') {
      setCustomAge(Math.floor(Math.random() * 9) + 15); // 15 - 23
      setCustomOvr(Math.floor(Math.random() * 26) + 55); // 55 - 80
    }
  };

  const handleRandomClubSelection = () => {
    sound.playTap();
    const randomClub = CLUBS_2026[Math.floor(Math.random() * CLUBS_2026.length)];
    const matchingLeague = LEAGUES_2026.find(l => l.id === randomClub.leagueId);
    if (matchingLeague) {
      setSelectedCountry(matchingLeague.country);
      setSelectedLeagueId(matchingLeague.id);
      setSelectedClubName(randomClub.name);
    }
  };

  const handleRandomiseEverything = () => {
    sound.playTap();
    const randomNation = NATIONS[Math.floor(Math.random() * NATIONS.length)];
    setNationality(randomNation);
    setFirstName(getRandomFirstName(randomNation));
    setLastName(getRandomLastName(randomNation));
    setPosition(POSITIONS[Math.floor(Math.random() * POSITIONS.length)]);

    const presets: StoryPreset[] = ['wonderkid', 'standard', 'late', 'custom'];
    const p = presets[Math.floor(Math.random() * presets.length)];
    setStoryPreset(p);
    setCustomAge(Math.floor(Math.random() * 9) + 15);
    setCustomOvr(Math.floor(Math.random() * 26) + 55);

    const randomClub = CLUBS_2026[Math.floor(Math.random() * CLUBS_2026.length)];
    const matchingLeague = LEAGUES_2026.find(l => l.id === randomClub.leagueId);
    if (matchingLeague) {
      setSelectedCountry(matchingLeague.country);
      setSelectedLeagueId(matchingLeague.id);
      setSelectedClubName(randomClub.name);
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    let startingOvr = 68;
    let mediaPot = 88;
    let startingAge = 18;

    if (storyPreset === 'wonderkid') {
      startingOvr = Math.floor(Math.random() * 9) + 70;
      mediaPot = Math.floor(Math.random() * 9) + 88;
      startingAge = Math.floor(Math.random() * 3) + 16; // 16 - 18
    } else if (storyPreset === 'standard') {
      startingOvr = Math.floor(Math.random() * 9) + 62;
      mediaPot = Math.floor(Math.random() * 9) + 80;
      startingAge = Math.floor(Math.random() * 5) + 15; // 15 - 19
    } else if (storyPreset === 'late') {
      startingOvr = Math.floor(Math.random() * 11) + 58;
      mediaPot = Math.floor(Math.random() * 11) + 75;
      startingAge = Math.floor(Math.random() * 4) + 20; // 20 - 23
    } else if (storyPreset === 'custom') {
      startingOvr = customOvr;
      startingAge = customAge;
      mediaPot = Math.min(99, customOvr + 15);
    }

    // Inherited trait bonus if child
    const traits = [];
    if (isChild && fatherPlayer.ovr >= 85) {
      traits.push({ id: 'dynasty_blood', name: '👑 Dynasty Bloodline', description: '+2 OVR growth boost', color: '#F1C40F' });
    }

    const club = getClubByName(selectedClubName);
    const startingYear = isChild ? fatherPlayer.year + 1 : 2026;

    const newPlayer: Player = {
      id: `${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      nationality,
      position,
      age: startingAge,
      ovr: startingOvr,
      mediaPot,
      club: club.name,
      clubColor: club.color,
      clubSecondaryColor: club.secondaryColor || '#1E1E1E',
      year: startingYear,
      generation,
      traits,
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
      // Rolled once here and never revealed directly — the same hidden
      // ceiling system Quick-Fire uses. Starting at a huge club doesn't
      // change these odds; roughly 80% of careers cap out at "solid pro"
      // or below regardless of starting circumstances.
      careerCeiling: rollCareerCeiling()
    };

    onComplete(newPlayer);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#2ECC71]/40 rounded-2xl w-full max-w-md p-5 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/30 text-[#2ECC71] mb-1">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            {isChild ? `GEN ${generation} CHILD CREATION` : 'CREATE YOUR FOOTBALL LEGACY'}
          </h2>
          <p className="text-xs text-white/50">
            {isChild 
              ? `You are playing as ${fatherPlayer.name}'s child. Continue the family dynasty!` 
              : 'Begin your footballing career. Shape your stats, nationality, and destination.'}
          </p>

          {/* Randomise Everything Button */}
          <button
            type="button"
            onClick={handleRandomiseEverything}
            className="mt-2 w-full bg-[#2A2A2A] hover:bg-[#333333] border border-[#2ECC71]/40 text-[#2ECC71] font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>RANDOMISE EVERYTHING</span>
          </button>
        </div>

        <form onSubmit={handleStart} className="space-y-3 text-xs">
          
          {/* Name inputs + Random Name Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-white/50 font-bold text-[10px] uppercase">Player Name</label>
              <button
                type="button"
                onClick={handleRandomName}
                className="text-[10px] text-[#2ECC71] hover:underline flex items-center space-x-1 font-mono font-bold cursor-pointer"
              >
                <Dices className="w-3 h-3" />
                <span>Random Name</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl p-2.5 text-white font-bold focus:border-[#2ECC71] outline-none"
              />
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl p-2.5 text-white font-bold focus:border-[#2ECC71] outline-none"
              />
            </div>
          </div>

          {/* Nationality & Position */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-white/50 font-bold text-[10px] uppercase">Nationality</label>
                <button
                  type="button"
                  onClick={handleRandomNation}
                  className="text-[10px] text-[#2ECC71] hover:underline flex items-center space-x-0.5 font-mono font-bold cursor-pointer"
                >
                  <Dices className="w-2.5 h-2.5" />
                </button>
              </div>
              <select
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl p-2.5 text-white font-bold focus:border-[#2ECC71] outline-none"
              >
                {NATIONS.map(n => (
                  <option key={n} value={n} className="bg-[#1E1E1E] text-white">{n}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-white/50 font-bold text-[10px] uppercase">Position</label>
                <button
                  type="button"
                  onClick={handleRandomPosition}
                  className="text-[10px] text-[#2ECC71] hover:underline flex items-center space-x-0.5 font-mono font-bold cursor-pointer"
                >
                  <Dices className="w-2.5 h-2.5" />
                </button>
              </div>
              <select
                value={position}
                onChange={e => setPosition(e.target.value as Position)}
                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl p-2.5 text-white font-bold focus:border-[#2ECC71] outline-none font-mono"
              >
                {POSITIONS.map(p => (
                  <option key={p} value={p} className="bg-[#1E1E1E] text-white">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Career Archetype */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-white/50 font-bold text-[10px] uppercase">Career Archetype</label>
              <button
                type="button"
                onClick={handleRandomPreset}
                className="text-[10px] text-[#2ECC71] hover:underline flex items-center space-x-1 font-mono font-bold cursor-pointer"
              >
                <Dices className="w-3 h-3" />
                <span>Random Preset</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setStoryPreset('wonderkid')}
                className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                  storyPreset === 'wonderkid' 
                    ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71] font-bold' 
                    : 'bg-[#2A2A2A] border-white/5 text-white/40'
                }`}
              >
                <div className="text-xs font-extrabold">Wonderkid</div>
                <div className="text-[9px] font-mono text-white/40 mt-0.5">70–78 OVR</div>
                <div className="text-[8px] font-mono text-white/30">Age 16–18</div>
              </button>

              <button
                type="button"
                onClick={() => setStoryPreset('standard')}
                className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                  storyPreset === 'standard' 
                    ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71] font-bold' 
                    : 'bg-[#2A2A2A] border-white/5 text-white/40'
                }`}
              >
                <div className="text-xs font-extrabold">Standard</div>
                <div className="text-[9px] font-mono text-white/40 mt-0.5">62–70 OVR</div>
                <div className="text-[8px] font-mono text-white/30">Age 15–19</div>
              </button>

              <button
                type="button"
                onClick={() => setStoryPreset('late')}
                className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                  storyPreset === 'late' 
                    ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71] font-bold' 
                    : 'bg-[#2A2A2A] border-white/5 text-white/40'
                }`}
              >
                <div className="text-xs font-extrabold">Late Bloomer</div>
                <div className="text-[9px] font-mono text-white/40 mt-0.5">58–68 OVR</div>
                <div className="text-[8px] font-mono text-white/30">Age 20–23</div>
              </button>

              <button
                type="button"
                onClick={() => setStoryPreset('custom')}
                className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                  storyPreset === 'custom' 
                    ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71] font-bold' 
                    : 'bg-[#2A2A2A] border-white/5 text-white/40'
                }`}
              >
                <div className="text-xs font-extrabold">Custom</div>
                <div className="text-[9px] font-mono text-white/40 mt-0.5">Choose Stats</div>
                <div className="text-[8px] font-mono text-white/30">Manual Age</div>
              </button>
            </div>
          </div>

          {/* Custom Age & OVR Inputs (Visible ONLY when Custom Archetype selected) */}
          {storyPreset === 'custom' && (
            <div className="bg-[#2A2A2A] border border-white/10 p-3 rounded-xl space-y-2">
              <div className="text-[10px] font-black text-[#2ECC71] uppercase tracking-wider">
                CUSTOM STARTING PARAMETERS
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] text-white/60 mb-1 font-bold">
                    <span>Starting Age:</span>
                    <span className="font-mono text-white font-extrabold">{customAge} yrs</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={23}
                    value={customAge}
                    onChange={e => setCustomAge(parseInt(e.target.value))}
                    className="w-full accent-[#2ECC71] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-white/60 mb-1 font-bold">
                    <span>Starting OVR:</span>
                    <span className="font-mono text-white font-extrabold">{customOvr} OVR</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={82}
                    value={customOvr}
                    onChange={e => setCustomOvr(parseInt(e.target.value))}
                    className="w-full accent-[#2ECC71] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CASCADING CLUB SELECTOR (Country -> League -> Club) */}
          <div className="bg-[#2A2A2A]/80 border border-white/10 p-3 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/70">
                Starting Club Selection
              </span>
              <button
                type="button"
                onClick={handleRandomClubSelection}
                className="text-[10px] text-[#2ECC71] hover:underline flex items-center space-x-1 font-mono font-bold cursor-pointer"
              >
                <Dices className="w-3 h-3" />
                <span>Random Club</span>
              </button>
            </div>

            <div className="space-y-2">
              {/* Step 1: Country */}
              <div>
                <label className="block text-white/40 font-bold text-[9px] uppercase mb-0.5">1. Country</label>
                <select
                  value={selectedCountry}
                  onChange={e => handleCountryChange(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg p-2 text-white font-bold focus:border-[#2ECC71] outline-none text-xs"
                >
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: League */}
              <div>
                <label className="block text-white/40 font-bold text-[9px] uppercase mb-0.5">2. League</label>
                <select
                  value={selectedLeagueId}
                  onChange={e => handleLeagueChange(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg p-2 text-white font-bold focus:border-[#2ECC71] outline-none text-xs"
                >
                  {availableLeagues.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} (Tier {l.tier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Club */}
              <div>
                <label className="block text-white/40 font-bold text-[9px] uppercase mb-0.5">3. Club</label>
                <select
                  value={selectedClubName}
                  onChange={e => setSelectedClubName(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg p-2 text-white font-bold focus:border-[#2ECC71] outline-none text-xs font-bold"
                >
                  {availableClubs.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.rating} OVR)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-black font-black text-xs py-3.5 rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 mt-2 uppercase tracking-wider cursor-pointer shadow-lg shadow-[#2ECC71]/20"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>KICKOFF CAREER</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

