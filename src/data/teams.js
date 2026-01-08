// Team data: slugs, colors, IDs, and display info
// IDs are from football-data.org API (https://www.football-data.org/)

export const teams = [
  {
    id: 57,
    slug: 'arsenal',
    name: 'Arsenal',
    shortName: 'ARS',
    colors: {
      primary: '#EF0107',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 58,
    slug: 'aston-villa',
    name: 'Aston Villa',
    shortName: 'AVL',
    colors: {
      primary: '#670E36',
      secondary: '#95BFE5',
    },
  },
  {
    id: 1044,
    slug: 'bournemouth',
    name: 'AFC Bournemouth',
    shortName: 'BOU',
    colors: {
      primary: '#DA291C',
      secondary: '#000000',
    },
  },
  {
    id: 402,
    slug: 'brentford',
    name: 'Brentford',
    shortName: 'BRE',
    colors: {
      primary: '#E30613',
      secondary: '#FBB800',
    },
  },
  {
    id: 397,
    slug: 'brighton',
    name: 'Brighton & Hove Albion',
    shortName: 'BHA',
    colors: {
      primary: '#0057B8',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 61,
    slug: 'chelsea',
    name: 'Chelsea',
    shortName: 'CHE',
    colors: {
      primary: '#034694',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 354,
    slug: 'crystal-palace',
    name: 'Crystal Palace',
    shortName: 'CRY',
    colors: {
      primary: '#1B458F',
      secondary: '#C4122E',
    },
  },
  {
    id: 62,
    slug: 'everton',
    name: 'Everton',
    shortName: 'EVE',
    colors: {
      primary: '#003399',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 63,
    slug: 'fulham',
    name: 'Fulham',
    shortName: 'FUL',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 71,
    slug: 'sunderland',
    name: 'Sunderland',
    shortName: 'SUN',
    colors: {
      primary: '#EB6E1F',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 64,
    slug: 'liverpool',
    name: 'Liverpool',
    shortName: 'LIV',
    colors: {
      primary: '#C8102E',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 341,
    slug: 'leeds',
    name: 'Leeds United',
    shortName: 'LEE',
    colors: {
      primary: '#FFCD00',
      secondary: '#1D428A',
    },
  },
  {
    id: 65,
    slug: 'man-city',
    name: 'Manchester City',
    shortName: 'MCI',
    colors: {
      primary: '#6CABDD',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 66,
    slug: 'man-utd',
    name: 'Manchester United',
    shortName: 'MUN',
    colors: {
      primary: '#DA291C',
      secondary: '#FBE122',
    },
  },
  {
    id: 67,
    slug: 'newcastle',
    name: 'Newcastle United',
    shortName: 'NEW',
    colors: {
      primary: '#241F20',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 351,
    slug: 'nottm-forest',
    name: 'Nottingham Forest',
    shortName: 'NFO',
    colors: {
      primary: '#DD0000',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 563,
    slug: 'west-ham',
    name: 'West Ham United',
    shortName: 'WHU',
    colors: {
      primary: '#7A263A',
      secondary: '#1BB1E7',
    },
  },
  {
    id: 328,
    slug: 'burnley',
    name: 'Burnley',
    shortName: 'BUR',
    colors: {
      primary: '#6C1D45',
      secondary: '#87CEEB',
    },
  },
  {
    id: 73,
    slug: 'tottenham',
    name: 'Tottenham Hotspur',
    shortName: 'TOT',
    colors: {
      primary: '#132257',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 76,
    slug: 'wolverhampton',
    name: 'Wolverhampton Wanderers',
    shortName: 'WOL',
    colors: {
      primary: '#FDB913',
      secondary: '#000000',
    },
  },
];

export function getTeamBySlug(slug) {
  return teams.find((team) => team.slug === slug.toLowerCase());
}

export function getTeamById(id) {
  return teams.find((team) => team.id === id);
}

export function getAllTeams() {
  return teams;
}

// Create a map for quick lookup
export const teamMap = teams.reduce((acc, team) => {
  acc[team.slug] = team;
  return acc;
}, {});
