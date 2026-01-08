// Netlify Function: Fetch and cache Premier League standings
// Caches for 1 hour

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4/competitions/PL/standings';
const CACHE_TTL = 3600000; // 1 hour in milliseconds

let cachedData = null;
let cacheTime = null;

async function fetchStandings() {
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
    return transformStandingsData(data);
  } catch (error) {
    console.error('Error fetching standings:', error);
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
    position: entry.position,
    points: entry.points,
    playedGames: entry.playedGames,
    won: entry.won,
    draw: entry.draw,
    lost: entry.lost,
    goalsFor: entry.goalsFor,
    goalsAgainst: entry.goalsAgainst,
    goalDifference: entry.goalDifference,
  }));

  return {
    timestamp: new Date().toISOString(),
    teams,
  };
}

export default async (req, context) => {
  // Check if we have cached data that's still fresh
  if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_TTL) {
    console.log('Returning cached standings data');
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
    const standings = await fetchStandings();

    // Update cache
    cachedData = standings;
    cacheTime = Date.now();

    return new Response(JSON.stringify(standings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache-Status': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error in get-standings function:', error);

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
        error: 'Failed to fetch standings data',
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
