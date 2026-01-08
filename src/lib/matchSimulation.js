// Match simulation: convert team strength into win/draw/loss probabilities

import { MATCH_PROBABILITIES, SIMULATION_PARAMS } from '../data/constants';

export function simulateMatch(homeTeam, awayTeam) {
  if (!homeTeam || !awayTeam || !homeTeam.strength || !awayTeam.strength) {
    return 'draw'; // Default to draw if data incomplete
  }

  const homeAdvantage = SIMULATION_PARAMS.HOME_ADVANTAGE;
  const strengthDiff = homeTeam.strength - awayTeam.strength;

  // Apply home advantage to strength difference
  const adjustedDiff = strengthDiff + homeAdvantage;

  // Map strength difference to win probability using logistic-like function
  const homeWinProb = clamp(
    MATCH_PROBABILITIES.BASE_HOME_WIN +
      adjustedDiff * MATCH_PROBABILITIES.STRENGTH_MULTIPLIER,
    MATCH_PROBABILITIES.MIN_HOME_WIN,
    MATCH_PROBABILITIES.MAX_HOME_WIN
  );

  // Draw probability decreases as gap widens
  const drawProb = Math.max(
    MATCH_PROBABILITIES.MIN_DRAW,
    MATCH_PROBABILITIES.BASE_DRAW -
      Math.abs(adjustedDiff) * MATCH_PROBABILITIES.DRAW_STRENGTH_IMPACT
  );

  // Away win is remainder
  const awayWinProb = 1 - homeWinProb - drawProb;

  // Ensure probabilities sum to 1 (handle floating point errors)
  const totalProb = homeWinProb + drawProb + awayWinProb;
  const normalizedHome = homeWinProb / totalProb;
  const normalizedDraw = drawProb / totalProb;
  // const normalizedAway = awayWinProb / totalProb;

  // Random result based on probabilities
  const rand = Math.random();

  if (rand < normalizedHome) return 'home';
  if (rand < normalizedHome + normalizedDraw) return 'draw';
  return 'away';
}

export function applyMatchResult(result, homeTeam, awayTeam, standingsTable) {
  if (!standingsTable || !Array.isArray(standingsTable)) {
    return standingsTable;
  }

  // Find team indices
  const homeIndex = standingsTable.findIndex((t) => t.id === homeTeam.id);
  const awayIndex = standingsTable.findIndex((t) => t.id === awayTeam.id);

  if (homeIndex === -1 || awayIndex === -1) {
    return standingsTable;
  }

  // Update scores based on result
  if (result === 'home') {
    // Home team wins: +3 points
    standingsTable[homeIndex].points += 3;
    standingsTable[homeIndex].won += 1;
    standingsTable[awayIndex].lost += 1;
  } else if (result === 'draw') {
    // Draw: +1 point each
    standingsTable[homeIndex].points += 1;
    standingsTable[awayIndex].points += 1;
    standingsTable[homeIndex].draw += 1;
    standingsTable[awayIndex].draw += 1;
  } else {
    // Away team wins: +3 points
    standingsTable[awayIndex].points += 3;
    standingsTable[awayIndex].won += 1;
    standingsTable[homeIndex].lost += 1;
  }

  // Update played games
  standingsTable[homeIndex].playedGames += 1;
  standingsTable[awayIndex].playedGames += 1;

  return standingsTable;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
