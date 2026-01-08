// Team data: slugs, colors, IDs, and display info

export const teams = [
  {
    id: 1,
    slug: 'arsenal',
    name: 'Arsenal',
    shortName: 'ARS',
    colors: {
      primary: '#EF0107',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 2,
    slug: 'aston-villa',
    name: 'Aston Villa',
    shortName: 'AVL',
    colors: {
      primary: '#670E36',
      secondary: '#95BFE5',
    },
  },
  {
    id: 3,
    slug: 'bournemouth',
    name: 'AFC Bournemouth',
    shortName: 'BOU',
    colors: {
      primary: '#DA291C',
      secondary: '#000000',
    },
  },
  {
    id: 4,
    slug: 'brentford',
    name: 'Brentford',
    shortName: 'BRE',
    colors: {
      primary: '#E30613',
      secondary: '#FBB800',
    },
  },
  {
    id: 5,
    slug: 'brighton',
    name: 'Brighton & Hove Albion',
    shortName: 'BHA',
    colors: {
      primary: '#0057B8',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 6,
    slug: 'chelsea',
    name: 'Chelsea',
    shortName: 'CHE',
    colors: {
      primary: '#034694',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 7,
    slug: 'crystal-palace',
    name: 'Crystal Palace',
    shortName: 'CRY',
    colors: {
      primary: '#1B458F',
      secondary: '#C4122E',
    },
  },
  {
    id: 8,
    slug: 'everton',
    name: 'Everton',
    shortName: 'EVE',
    colors: {
      primary: '#003399',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 9,
    slug: 'fulham',
    name: 'Fulham',
    shortName: 'FUL',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 10,
    slug: 'ipswich',
    name: 'Ipswich Town',
    shortName: 'IPS',
    colors: {
      primary: '#3A64A3',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 11,
    slug: 'leicester',
    name: 'Leicester City',
    shortName: 'LEI',
    colors: {
      primary: '#003090',
      secondary: '#FDBE11',
    },
  },
  {
    id: 12,
    slug: 'liverpool',
    name: 'Liverpool',
    shortName: 'LIV',
    colors: {
      primary: '#C8102E',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 13,
    slug: 'leeds',
    name: 'Leeds United',
    shortName: 'LEE',
    colors: {
      primary: '#FFCD00',
      secondary: '#1D428A',
    },
  },
  {
    id: 14,
    slug: 'man-city',
    name: 'Manchester City',
    shortName: 'MCI',
    colors: {
      primary: '#6CABDD',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 15,
    slug: 'man-utd',
    name: 'Manchester United',
    shortName: 'MUN',
    colors: {
      primary: '#DA291C',
      secondary: '#FBE122',
    },
  },
  {
    id: 16,
    slug: 'newcastle',
    name: 'Newcastle United',
    shortName: 'NEW',
    colors: {
      primary: '#241F20',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 17,
    slug: 'nottm-forest',
    name: 'Nottingham Forest',
    shortName: 'NFO',
    colors: {
      primary: '#DD0000',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 18,
    slug: 'southampton',
    name: 'Southampton',
    shortName: 'SOU',
    colors: {
      primary: '#D71920',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 19,
    slug: 'tottenham',
    name: 'Tottenham Hotspur',
    shortName: 'TOT',
    colors: {
      primary: '#132257',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 20,
    slug: 'west-ham',
    name: 'West Ham United',
    shortName: 'WHU',
    colors: {
      primary: '#7A263A',
      secondary: '#1BB1E7',
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
