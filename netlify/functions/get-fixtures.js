// Netlify Function: Fetch and cache fixtures for any football competition
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

async function fetchFixtures(competitionCode = 'PL') {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY environment variable is not set');
  }

  const apiUrl = `${FOOTBALL_DATA_BASE_API}/${competitionCode}/matches?status=SCHEDULED`;

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
    return transformFixturesData(data);
  } catch (error) {
    console.error(`Error fetching fixtures for ${competitionCode}:`, error);
    throw error;
  }
}

function transformFixturesData(rawData) {
  // Filter and transform scheduled matches
  const fixtures = rawData.matches
    .filter((match) => match.status === 'SCHEDULED')
    .map((match) => ({
      id: match.id,
      utcDate: match.utcDate,
      status: match.status,
      stage: match.stage,
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        shortName: match.homeTeam.shortName,
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        shortName: match.awayTeam.shortName,
      },
    }))
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

  return {
    timestamp: new Date().toISOString(),
    count: fixtures.length,
    fixtures,
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
    console.log(`Returning cached fixtures data for ${competitionCode}`);
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
    const fixtures = await fetchFixtures(competitionCode);

    // Update cache
    caches[cacheKey].data = fixtures;
    caches[cacheKey].time = Date.now();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache-Status': 'MISS',
      },
      body: JSON.stringify(fixtures),
    };
  } catch (error) {
    console.error(`Error in get-fixtures function for ${competitionCode}:`, error);

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
        error: 'Failed to fetch fixtures data',
        message: error.message,
      }),
    };
  }
};
