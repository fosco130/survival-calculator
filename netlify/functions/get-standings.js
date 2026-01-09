// Netlify Function: Fetch and cache standings for any football competition
// Caches for 1 hour
// Query parameter: ?competition=PL (defaults to PL)

const FOOTBALL_DATA_BASE_API = 'https://api.football-data.org/v4/competitions';
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Separate caches for each competition
const caches = {};

function getCacheKey(competitionCode) {
  return competitionCode || 'PL';
}

function initCacheForCompetition(competitionCode) {
  const key = getCacheKey(competitionCode);
  if (!caches[key]) {
    caches[key] = { data: null, time: null };
  }
}

async function fetchStandings(competitionCode = 'PL') {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY environment variable is not set');
  }

  const apiUrl = `${FOOTBALL_DATA_BASE_API}/${competitionCode}/standings`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return transformStandingsData(data);
  } catch (error) {
    console.error(`Error fetching standings for ${competitionCode}:`, error);
    throw error;
  }
}

function transformStandingsData(rawData) {
  // Extract the TOTAL standings table
  const standingsData = rawData.standings.find((s) => s.type === 'TOTAL');

  if (!standingsData) {
    throw new Error('No TOTAL standings data found');
  }

  // Transform each team entry
  const teams = standingsData.table.map((entry) => ({
    id: entry.team.id,
    name: entry.team.name,
    shortName: entry.team.shortName,
    crest: entry.team.crest, // Include club crest URL from API
    position: entry.position,
    points: entry.points,
    playedGames: entry.playedGames,
    won: entry.won,
    draw: entry.draw,
    lost: entry.lost,
    goalsFor: entry.goalsFor,
    goalsAgainst: entry.goalsAgainst,
    goalDifference: entry.goalDifference,
    form: entry.form, // Recent form as string "W,L,D,W,W"
  }));

  return {
    timestamp: new Date().toISOString(),
    competition: rawData.competition.code,
    teams,
  };
}

export const handler = async (event, context) => {
  // Get competition code from query parameters (default to PL)
  const competitionCode = event.queryStringParameters?.competition || 'PL';

  initCacheForCompetition(competitionCode);
  const cacheKey = getCacheKey(competitionCode);
  const { data: cachedData, time: cacheTime } = caches[cacheKey];

  // Check if we have cached data that's still fresh
  if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_TTL) {
    console.log(`Returning cached standings data for ${competitionCode}`);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache-Status': 'HIT',
      },
      body: JSON.stringify(cachedData),
    };
  }

  try {
    const standings = await fetchStandings(competitionCode);

    // Update cache
    caches[cacheKey].data = standings;
    caches[cacheKey].time = Date.now();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache-Status': 'MISS',
      },
      body: JSON.stringify(standings),
    };
  } catch (error) {
    console.error(`Error in get-standings function for ${competitionCode}:`, error);

    // Return cached data as fallback if available
    if (cachedData) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
          'X-Cache-Status': 'STALE',
          'X-Error': 'Using stale cache due to API error',
        },
        body: JSON.stringify(cachedData),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch standings data',
        message: error.message,
      }),
    };
  }
};
