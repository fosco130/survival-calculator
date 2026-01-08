// Monte Carlo simulation engine
// Runs 10,000 iterations to calculate survival probability

import { SIMULATION_PARAMS, RELEGATION_THRESHOLDS } from '../data/constants';
import { getStrengthForAllTeams } from './teamStrength';
import { simulateMatch, applyMatchResult } from './matchSimulation';

export function runSurvivalSimulation(targetTeam, standings, fixtures, scenarios = {}) {
  if (
    !targetTeam ||
    !standings ||
    !Array.isArray(standings) ||
    !fixtures ||
    !Array.isArray(fixtures)
  ) {
    console.error('Invalid data for simulation:', { targetTeam, standings, fixtures });
    return 0;
  }

  // Filter remaining fixtures (those not yet played)
  const remainingFixtures = fixtures.filter((fixture) => fixture.status === 'SCHEDULED');

  if (remainingFixtures.length === 0) {
    // No fixtures left, check current position
    const position = standings.findIndex((t) => t.id === targetTeam.id) + 1;
    return position <= RELEGATION_THRESHOLDS.SAFE_POSITION ? 100 : 0;
  }

  let survivalCount = 0;
  const iterations = SIMULATION_PARAMS.ITERATIONS;

  // Calculate strength for all teams once (outside loop for performance)
  const teamsWithStrength = getStrengthForAllTeams(standings);

  for (let i = 0; i < iterations; i++) {
    // Deep clone the standings for this simulation run
    const simulatedTable = JSON.parse(JSON.stringify(teamsWithStrength));

    // Simulate each remaining fixture
    for (const fixture of remainingFixtures) {
      // Check if user has set a scenario for this fixture
      const fixtureKey = `${fixture.id}`;
      let result;

      if (scenarios && scenarios[fixtureKey]) {
        // Use user-provided scenario
        result = scenarios[fixtureKey];
      } else {
        // Simulate the match based on team strength
        const homeTeam = simulatedTable.find((t) => t.id === fixture.homeTeam.id);
        const awayTeam = simulatedTable.find((t) => t.id === fixture.awayTeam.id);

        if (!homeTeam || !awayTeam) {
          console.warn('Team not found in simulated table:', {
            homeTeam: fixture.homeTeam.id,
            awayTeam: fixture.awayTeam.id,
          });
          continue;
        }

        result = simulateMatch(homeTeam, awayTeam);
      }

      // Apply result to simulated table
      const homeTeam = simulatedTable.find((t) => t.id === fixture.homeTeam.id);
      const awayTeam = simulatedTable.find((t) => t.id === fixture.awayTeam.id);

      if (homeTeam && awayTeam) {
        applyMatchResult(result, homeTeam, awayTeam, simulatedTable);
      }
    }

    // Sort table by final standings (points, then goal difference, then goals for)
    simulatedTable.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    // Check if target team survived (position 17 or higher)
    const finalPosition = simulatedTable.findIndex((t) => t.id === targetTeam.id) + 1;

    if (finalPosition <= RELEGATION_THRESHOLDS.SAFE_POSITION) {
      survivalCount++;
    }
  }

  // Calculate percentage and round to 1 decimal place
  const percentage = (survivalCount / iterations) * 100;
  return Math.round(percentage * 10) / 10;
}

// Get fixtures for specific team
export function getTeamFixtures(teamId, fixtures) {
  if (!fixtures || !Array.isArray(fixtures)) {
    return [];
  }

  return fixtures.filter(
    (fixture) =>
      (fixture.homeTeam.id === teamId || fixture.awayTeam.id === teamId) &&
      fixture.status === 'SCHEDULED'
  );
}

// Get current team standing
export function getTeamStanding(teamId, standings) {
  if (!standings || !Array.isArray(standings)) {
    return null;
  }

  return standings.find((team) => team.id === teamId);
}
