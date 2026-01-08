/**
 * Test Fixtures for Premier League Survival Calculator
 * Provides seeded random generation for deterministic Monte Carlo testing
 */

/**
 * Linear Congruential Generator (LCG) for deterministic pseudo-random numbers
 * Allows exact reproducibility: same seed = same random sequence every time
 *
 * ★ Insight ─────────────────────────────────────
 * Monte Carlo simulations use Math.random() which is non-deterministic, making
 * tests unreliable. By injecting a seeded PRNG, we can test the exact behavior
 * with the same "random" outcomes each run. The LCG algorithm is simple but
 * sufficient for simulation testing.
 * ─────────────────────────────────────────────────
 */
export function createSeededRandom(seed = 12345) {
  let state = seed;
  return function() {
    // LCG formula: (a*x + c) mod m
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Minimal test standings data for Monte Carlo testing
 * Includes relegation zone teams for survival simulation
 */
export const testStandings = [
  {
    id: 66,
    team: { id: 66, name: 'Ipswich Town', shortName: 'IPS' },
    position: 17,
    playedGames: 18,
    points: 14,
    won: 4,
    draw: 2,
    lost: 12,
    goalsFor: 16,
    goalsAgainst: 34,
    goalDifference: -18,
    last6Points: 0
  },
  {
    id: 340,
    team: { id: 340, name: 'Southampton', shortName: 'SOU' },
    position: 19,
    playedGames: 18,
    points: 8,
    won: 2,
    draw: 2,
    lost: 14,
    goalsFor: 12,
    goalsAgainst: 38,
    goalDifference: -26,
    last6Points: 0
  },
  {
    id: 1,
    team: { id: 1, name: 'Arsenal', shortName: 'ARS' },
    position: 1,
    playedGames: 18,
    points: 45,
    won: 14,
    draw: 3,
    lost: 1,
    goalsFor: 48,
    goalsAgainst: 15,
    goalDifference: 33,
    last6Points: 15
  },
  {
    id: 8,
    team: { id: 8, name: 'Chelsea', shortName: 'CHE' },
    position: 3,
    playedGames: 18,
    points: 40,
    won: 12,
    draw: 4,
    lost: 2,
    goalsFor: 42,
    goalsAgainst: 18,
    goalDifference: 24,
    last6Points: 13
  },
  {
    id: 58,
    team: { id: 58, name: 'Manchester City', shortName: 'MCI' },
    position: 2,
    playedGames: 18,
    points: 44,
    won: 13,
    draw: 5,
    lost: 0,
    goalsFor: 50,
    goalsAgainst: 12,
    goalDifference: 38,
    last6Points: 16
  }
];

/**
 * Test fixtures (remaining matches to simulate)
 */
export const testFixtures = [
  {
    id: 1,
    homeTeam: { id: 66, name: 'Ipswich Town' },
    awayTeam: { id: 340, name: 'Southampton' },
    status: 'SCHEDULED',
    date: '2026-01-21'
  },
  {
    id: 2,
    homeTeam: { id: 1, name: 'Arsenal' },
    awayTeam: { id: 66, name: 'Ipswich Town' },
    status: 'SCHEDULED',
    date: '2026-01-28'
  },
  {
    id: 3,
    homeTeam: { id: 340, name: 'Southampton' },
    awayTeam: { id: 8, name: 'Chelsea' },
    status: 'SCHEDULED',
    date: '2026-02-04'
  }
];

/**
 * Helper to deep clone an object (for standings mutation during simulation)
 */
export function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => cloneDeep(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = cloneDeep(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Helper to sort standings table by points, goal difference, goals for
 */
export function sortTable(standings) {
  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}
