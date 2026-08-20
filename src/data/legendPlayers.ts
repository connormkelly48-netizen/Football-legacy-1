import { Position } from '../types';

/**
 * NOTE: Real player names and stats are used as-is for this prototype build.
 * Before any public release, these data entries will need to be swapped for
 * fictionalized names and statistics to comply with real-name licensing.
 */

export interface RealCareerBaseline {
  careerGoals: number;
  careerAssists: number;
  careerTrophies: number;
  careerCaps: number;
  peakMarketValue: string;
  careerLength: number; // in seasons
  clubsPlayedFor: string[];
  historicalSummary: string;
}

export interface LegendPlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  nationality: string;
  position: Position;
  startingAge: number;
  startingOvr: number;
  mediaPot: number;
  startingClub: string;
  startingSeason: number;
  realBaseline: RealCareerBaseline;
}

export const LEGEND_PLAYERS: LegendPlayerProfile[] = [
  {
    id: 'messi_06',
    firstName: 'Lionel',
    lastName: 'Messi',
    name: 'Lionel Messi',
    nationality: 'Argentina',
    position: 'RW',
    startingAge: 18,
    startingOvr: 85,
    mediaPot: 96,
    startingClub: 'Barcelona',
    startingSeason: 2006,
    realBaseline: {
      careerGoals: 838,
      careerAssists: 374,
      careerTrophies: 44,
      careerCaps: 187,
      peakMarketValue: '€180M',
      careerLength: 20,
      clubsPlayedFor: ['Barcelona', 'Paris Saint-Germain', 'Inter Miami'],
      historicalSummary: 'Won 8 Ballon d’Ors, 4 Champions Leagues, and the 2022 FIFA World Cup.'
    }
  },
  {
    id: 'ronaldo_03',
    firstName: 'Cristiano',
    lastName: 'Ronaldo',
    name: 'Cristiano Ronaldo',
    nationality: 'Portugal',
    position: 'LW',
    startingAge: 18,
    startingOvr: 83,
    mediaPot: 95,
    startingClub: 'Manchester United',
    startingSeason: 2003,
    realBaseline: {
      careerGoals: 895,
      careerAssists: 254,
      careerTrophies: 33,
      careerCaps: 212,
      peakMarketValue: '€120M',
      careerLength: 22,
      clubsPlayedFor: ['Sporting CP', 'Manchester United', 'Real Madrid', 'Juventus', 'Al Nassr'],
      historicalSummary: 'All-time men’s international goalscorer with 5 Champions Leagues and 5 Ballon d’Ors.'
    }
  },
  {
    id: 'mbappe_17',
    firstName: 'Kylian',
    lastName: 'Mbappé',
    name: 'Kylian Mbappé',
    nationality: 'France',
    position: 'ST',
    startingAge: 18,
    startingOvr: 86,
    mediaPot: 95,
    startingClub: 'Monaco',
    startingSeason: 2017,
    realBaseline: {
      careerGoals: 310,
      careerAssists: 140,
      careerTrophies: 18,
      careerCaps: 84,
      peakMarketValue: '€180M',
      careerLength: 10,
      clubsPlayedFor: ['Monaco', 'Paris Saint-Germain', 'Real Madrid'],
      historicalSummary: 'World Cup winner (2018) and record-breaking goal machine.'
    }
  },
  {
    id: 'bellingham_20',
    firstName: 'Jude',
    lastName: 'Bellingham',
    name: 'Jude Bellingham',
    nationality: 'England',
    position: 'CAM',
    startingAge: 17,
    startingOvr: 80,
    mediaPot: 93,
    startingClub: 'Real Madrid', // or Dortmund era
    startingSeason: 2020,
    realBaseline: {
      careerGoals: 85,
      careerAssists: 55,
      careerTrophies: 3,
      careerCaps: 36,
      peakMarketValue: '€180M',
      careerLength: 6,
      clubsPlayedFor: ['Birmingham City', 'Borussia Dortmund', 'Real Madrid'],
      historicalSummary: 'Sensational midfielder who took Europe by storm with clutch goals and leadership.'
    }
  },
  {
    id: 'haaland_19',
    firstName: 'Erling',
    lastName: 'Haaland',
    name: 'Erling Haaland',
    nationality: 'Norway',
    position: 'ST',
    startingAge: 19,
    startingOvr: 84,
    mediaPot: 94,
    startingClub: 'Borussia Dortmund',
    startingSeason: 2019,
    realBaseline: {
      careerGoals: 255,
      careerAssists: 50,
      careerTrophies: 7,
      careerCaps: 35,
      peakMarketValue: '€200M',
      careerLength: 7,
      clubsPlayedFor: ['Bryne FK', 'Molde', 'RB Salzburg', 'Borussia Dortmund', 'Manchester City'],
      historicalSummary: 'Unstoppable goalscoring powerhouse breaking Premier League records.'
    }
  },
  {
    id: 'zidane_92',
    firstName: 'Zinedine',
    lastName: 'Zidane',
    name: 'Zinedine Zidane',
    nationality: 'France',
    position: 'CAM',
    startingAge: 20,
    startingOvr: 84,
    mediaPot: 95,
    startingClub: 'Bordeaux',
    startingSeason: 1992,
    realBaseline: {
      careerGoals: 125,
      careerAssists: 140,
      careerTrophies: 15,
      careerCaps: 108,
      peakMarketValue: '€75M',
      careerLength: 18,
      clubsPlayedFor: ['Cannes', 'Bordeaux', 'Juventus', 'Real Madrid'],
      historicalSummary: 'World Cup winner, Ballon d’Or recipient, and maestro of elegance.'
    }
  },
  {
    id: 'henry_94',
    firstName: 'Thierry',
    lastName: 'Henry',
    name: 'Thierry Henry',
    nationality: 'France',
    position: 'LW',
    startingAge: 17,
    startingOvr: 79,
    mediaPot: 93,
    startingClub: 'Monaco',
    startingSeason: 1994,
    realBaseline: {
      careerGoals: 360,
      careerAssists: 175,
      careerTrophies: 19,
      careerCaps: 123,
      peakMarketValue: '€90M',
      careerLength: 20,
      clubsPlayedFor: ['Monaco', 'Juventus', 'Arsenal', 'Barcelona', 'New York Red Bulls'],
      historicalSummary: 'Arsenal’s greatest ever player and Invincibles talisman.'
    }
  },
  {
    id: 'ronaldinho_98',
    firstName: 'Ronaldinho',
    lastName: 'Gaúcho',
    name: 'Ronaldinho',
    nationality: 'Brazil',
    position: 'CAM',
    startingAge: 18,
    startingOvr: 82,
    mediaPot: 96,
    startingClub: 'Barcelona', // started at Gremio or PSG
    startingSeason: 1998,
    realBaseline: {
      careerGoals: 280,
      careerAssists: 180,
      careerTrophies: 16,
      careerCaps: 97,
      peakMarketValue: '€100M',
      careerLength: 17,
      clubsPlayedFor: ['Grêmio', 'Paris Saint-Germain', 'Barcelona', 'AC Milan', 'Flamengo', 'Atlético Mineiro'],
      historicalSummary: 'Brought pure joy to football with unmatched skill and a Ballon d’Or in 2005.'
    }
  },
  {
    id: 'kaka_01',
    firstName: 'Kaká',
    lastName: '',
    name: 'Kaká',
    nationality: 'Brazil',
    position: 'CAM',
    startingAge: 19,
    startingOvr: 81,
    mediaPot: 94,
    startingClub: 'AC Milan',
    startingSeason: 2001,
    realBaseline: {
      careerGoals: 208,
      careerAssists: 155,
      careerTrophies: 11,
      careerCaps: 92,
      peakMarketValue: '€110M',
      careerLength: 16,
      clubsPlayedFor: ['São Paulo', 'AC Milan', 'Real Madrid', 'Orlando City'],
      historicalSummary: 'Ballon d’Or winner in 2007, legendary box-to-box playmaker.'
    }
  },
  {
    id: 'de_bruyne_12',
    firstName: 'Kevin',
    lastName: 'De Bruyne',
    name: 'Kevin De Bruyne',
    nationality: 'Belgium',
    position: 'CAM',
    startingAge: 20,
    startingOvr: 82,
    mediaPot: 94,
    startingClub: 'Manchester City',
    startingSeason: 2012,
    realBaseline: {
      careerGoals: 150,
      careerAssists: 270,
      careerTrophies: 22,
      careerCaps: 105,
      peakMarketValue: '€150M',
      careerLength: 15,
      clubsPlayedFor: ['Genk', 'Werder Bremen', 'Chelsea', 'Wolfsburg', 'Manchester City'],
      historicalSummary: 'One of the greatest playmakers in Premier League history.'
    }
  },
  {
    id: 'kane_14',
    firstName: 'Harry',
    lastName: 'Kane',
    name: 'Harry Kane',
    nationality: 'England',
    position: 'ST',
    startingAge: 20,
    startingOvr: 80,
    mediaPot: 92,
    startingClub: 'Tottenham Hotspur',
    startingSeason: 2014,
    realBaseline: {
      careerGoals: 380,
      careerAssists: 115,
      careerTrophies: 2,
      careerCaps: 98,
      peakMarketValue: '€150M',
      careerLength: 14,
      clubsPlayedFor: ['Tottenham Hotspur', 'Bayern Munich'],
      historicalSummary: 'Prolific goalscorer and England’s all-time leading scorer.'
    }
  },
  {
    id: 'yamal_23',
    firstName: 'Lamine',
    lastName: 'Yamal',
    name: 'Lamine Yamal',
    nationality: 'Spain',
    position: 'RW',
    startingAge: 16,
    startingOvr: 82,
    mediaPot: 97,
    startingClub: 'Barcelona',
    startingSeason: 2023,
    realBaseline: {
      careerGoals: 35,
      careerAssists: 45,
      careerTrophies: 3,
      careerCaps: 18,
      peakMarketValue: '€150M',
      careerLength: 3,
      clubsPlayedFor: ['Barcelona'],
      historicalSummary: 'European Championship winner and record-shattering teenage sensation.'
    }
  }
];
