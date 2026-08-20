import { Competition } from '../../../types/database';
import { LEAGUES_2026_27 } from '../leagues';

/**
 * One DOMESTIC_LEAGUE competition per league, derived automatically.
 * Participants are NOT hard-coded — determined at simulation time by
 * `club.leagueId === competition.leagueId`.
 */
const domesticLeagueCompetitions: Competition[] = LEAGUES_2026_27.map(league => ({
  id: `comp_${league.id.toLowerCase()}`,
  name: league.name,
  type: 'DOMESTIC_LEAGUE' as const,
  countryId: league.countryId,
  leagueId: league.id,
  qualificationRule: 'All clubs where club.leagueId matches this competition\'s leagueId.',
  promotionRule: league.promotionTo
    ? `Bottom-placed clubs move to ${league.promotionTo} at season end (exact count/playoffs vary by country).`
    : undefined,
  relegationRule: league.relegationTo
    ? `Bottom-placed clubs relegate to ${league.relegationTo} at season end.`
    : undefined,
  hasPlayoffs: ['ENG_CHAMP', 'ITA_SERIEB', 'BEL_PRO', 'AUT_2LIGA'].includes(league.id),
}));

/** Major domestic cup competitions — single-elimination, open to a country's full pyramid. */
const domesticCups: Competition[] = [
  { id: 'cup_eng_facup', name: 'FA Cup', type: 'DOMESTIC_CUP', countryId: 'ENG', qualificationRule: 'Open to all clubs in the English football pyramid, entering at different rounds by tier.' },
  { id: 'cup_esp_copadelrey', name: 'Copa del Rey', type: 'DOMESTIC_CUP', countryId: 'ESP', qualificationRule: 'Open to all clubs in the top four Spanish tiers.' },
  { id: 'cup_ger_dfbpokal', name: 'DFB-Pokal', type: 'DOMESTIC_CUP', countryId: 'GER', qualificationRule: 'Bundesliga, 2. Bundesliga and 3. Liga clubs plus regional cup winners.' },
  { id: 'cup_ita_coppaitalia', name: 'Coppa Italia', type: 'DOMESTIC_CUP', countryId: 'ITA', qualificationRule: 'Serie A and Serie B clubs plus Serie C qualifiers.' },
  { id: 'cup_fra_coupedefrance', name: 'Coupe de France', type: 'DOMESTIC_CUP', countryId: 'FRA', qualificationRule: 'Open to all affiliated French football clubs, amateur and professional.' },
  { id: 'cup_por_tacadeportugal', name: 'Taça de Portugal', type: 'DOMESTIC_CUP', countryId: 'POR', qualificationRule: 'Open to all clubs in the Portuguese football pyramid.' },
  { id: 'cup_ned_knvbbeker', name: 'KNVB Beker', type: 'DOMESTIC_CUP', countryId: 'NED', qualificationRule: 'Eredivisie and Eerste Divisie clubs plus amateur qualifiers.' },
  { id: 'cup_bel_beker', name: 'Belgian Cup', type: 'DOMESTIC_CUP', countryId: 'BEL', qualificationRule: 'Open to all clubs in the Belgian football pyramid.' },
  { id: 'cup_aut_ofbcup', name: 'ÖFB-Cup', type: 'DOMESTIC_CUP', countryId: 'AUT', qualificationRule: 'Open to all clubs in the Austrian football pyramid.' },
  { id: 'cup_sui_schweizercup', name: 'Swiss Cup', type: 'DOMESTIC_CUP', countryId: 'SUI', qualificationRule: 'Open to all clubs in the Swiss football pyramid.' },
  { id: 'cup_sco_scottishcup', name: 'Scottish Cup', type: 'DOMESTIC_CUP', countryId: 'SCO', qualificationRule: 'Open to all clubs in the Scottish football pyramid.' },
  { id: 'cup_irl_faicup', name: 'FAI Cup', type: 'DOMESTIC_CUP', countryId: 'IRL', qualificationRule: 'Premier Division and First Division clubs plus qualifiers.' },
  { id: 'cup_tur_turkiyekupasi', name: 'Türkiye Kupası', type: 'DOMESTIC_CUP', countryId: 'TUR', qualificationRule: 'Süper Lig and 1. Lig clubs plus lower-tier qualifiers.' },
];

/** League cups — a smaller subset of countries run a separate League Cup alongside their main domestic cup. */
const leagueCups: Competition[] = [
  { id: 'cup_eng_efl', name: 'EFL Cup', type: 'DOMESTIC_CUP', countryId: 'ENG', qualificationRule: 'All 92 clubs across the Premier League and three EFL divisions.' },
  { id: 'cup_sco_leaguecup', name: 'Scottish League Cup', type: 'DOMESTIC_CUP', countryId: 'SCO', qualificationRule: 'All clubs in the Scottish Premiership and Championship, plus lower-tier entrants.' },
  { id: 'cup_por_tacadaliga', name: 'Taça da Liga', type: 'DOMESTIC_CUP', countryId: 'POR', qualificationRule: 'Liga Portugal and Liga Portugal 2 clubs.' },
  { id: 'cup_irl_leaguecup', name: 'League of Ireland Cup', type: 'DOMESTIC_CUP', countryId: 'IRL', qualificationRule: 'Premier Division and First Division clubs.' },
];

/** UEFA continental competitions — participants determined by qualification, never hard-coded here. */
const uefaCompetitions: Competition[] = [
  {
    id: 'comp_uefa_ucl', name: 'UEFA Champions League', type: 'CONTINENTAL',
    qualificationRule: 'Top-placed clubs from each domestic league, allocation per country determined by UEFA coefficient ranking (typically 1-5 clubs per country).',
  },
  {
    id: 'comp_uefa_uel', name: 'UEFA Europa League', type: 'CONTINENTAL',
    qualificationRule: 'Clubs placing just below Champions League qualification, plus domestic cup winners not otherwise qualified.',
  },
  {
    id: 'comp_uefa_uecl', name: 'UEFA Conference League', type: 'CONTINENTAL',
    qualificationRule: 'Clubs placing below Europa League qualification, plus domestic cup runners-up and smaller-nation cup winners.',
  },
];

export const COMPETITIONS_2026_27: Competition[] = [
  ...domesticLeagueCompetitions,
  ...domesticCups,
  ...leagueCups,
  ...uefaCompetitions,
];
