// Netlify Function: Fetch and cache Premier League scheduled fixtures
// Caches for 1 hour

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED';
const CACHE_TTL = 3600000; // 1 hour in milliseconds

let cachedData = null;
let cacheTime = null;

async function fetchFixtures() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(FOOTBALL_DATA_API, {
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
    console.error('Error fetching fixtures:', error);
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

export default async (req, context) => {
  // Check if we have cached data that's still fresh
  if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_TTL) {
    console.log('Returning cached fixtures data');
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache-Status': 'HIT',
      },
    });
  }

  try {
    const fixtures = await fetchFixtures();

    // Update cache
    cachedData = fixtures;
    cacheTime = Date.now();

    return new Response(JSON.stringify(fixtures), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache-Status': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error in get-fixtures function:', error);

    // Return cached data as fallback if available
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
          'X-Cache-Status': 'STALE',
          'X-Error': 'Using stale cache due to API error',
        },
      });
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch fixtures data',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
