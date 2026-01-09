/**
 * Fixture Analysis Utilities
 * Analyzes upcoming fixtures to determine difficulty and expected outcomes
 */

export const DIFFICULTY_LEVELS = {
  HARD: {
    label: 'Hard',
    color: '#DC2626',
    emoji: '🚨',
    expectedPoints: 0.3,
    positionRange: [1, 6],
  },
  MEDIUM: {
    label: 'Medium',
    color: '#F59E0B',
    emoji: '⚠️',
    expectedPoints: 1.0,
    positionRange: [7, 14],
  },
  WINNABLE: {
    label: 'Winnable',
    color: '#059669',
    emoji: '✅',
    expectedPoints: 2.0,
    positionRange: [15, 20],
  },
};

/**
 * Determine fixture difficulty based on opponent position and home/away status
 * @param {number} opponentPosition - Opponent's league position (1-20)
 * @param {boolean} isHome - Whether our team is playing at home
 * @returns {object} Difficulty object with label, color, emoji, expectedPoints
 */
export function getFixtureDifficulty(opponentPosition, isHome = true) {
  let difficulty;

  if (opponentPosition >= 1 && opponentPosition <= 6) {
    difficulty = DIFFICULTY_LEVELS.HARD;
  } else if (opponentPosition >= 7 && opponentPosition <= 14) {
    difficulty = DIFFICULTY_LEVELS.MEDIUM;
  } else {
    difficulty = DIFFICULTY_LEVELS.WINNABLE;
  }

  // Home advantage: +0.5 expected points
  const expectedPoints = isHome ? difficulty.expectedPoints + 0.5 : difficulty.expectedPoints;

  return {
    ...difficulty,
    expectedPoints: Math.min(expectedPoints, 3.0), // Cap at 3 points max
  };
}

/**
 * Analyze all fixtures and calculate expected points
 * @param {array} fixtures - Array of fixture objects
 * @param {number} teamId - Your team ID
 * @param {object} standings - Standings data with all teams
 * @returns {object} Analysis with total expected points and breakdown
 */
export function analyzeFixtures(fixtures, teamId, standings) {
  if (!fixtures || !standings || !standings.teams) {
    return {
      expectedPoints: 0,
      breakdown: [],
      totalFixtures: 0,
    };
  }

  const standingsMap = {};
  standings.teams.forEach((team) => {
    standingsMap[team.id] = team;
  });

  const breakdown = fixtures.map((fixture) => {
    // Determine if team is home or away
    const isHome = fixture.homeTeam.id === teamId;
    const opponentId = isHome ? fixture.awayTeam.id : fixture.homeTeam.id;
    const opponent = standingsMap[opponentId];
    const opponentPosition = opponent?.position || 20; // Default to lower position if not found

    const difficulty = getFixtureDifficulty(opponentPosition, isHome);

    return {
      fixtureId: fixture.id,
      opponent: fixture.homeTeam.id === teamId ? fixture.awayTeam : fixture.homeTeam,
      opponentPosition,
      isHome,
      difficulty,
      expectedPoints: difficulty.expectedPoints,
    };
  });

  const totalExpectedPoints = breakdown.reduce(
    (sum, fixture) => sum + fixture.expectedPoints,
    0
  );

  return {
    expectedPoints: Math.round(totalExpectedPoints * 10) / 10,
    breakdown,
    totalFixtures: breakdown.length,
  };
}

/**
 * Get verdict on if expected points should be enough for safety
 * @param {number} expectedPoints - Expected points from remaining fixtures
 * @param {number} safetyThreshold - Points typically needed for safety
 * @returns {object} Verdict with assessment and confidence
 */
export function getFixtureVerdict(expectedPoints, safetyThreshold) {
  const gap = safetyThreshold - expectedPoints;
  const percent = (expectedPoints / safetyThreshold) * 100;

  if (percent >= 100) {
    return {
      verdict: "Should be enough to stay up ✅",
      confidence: 'high',
      emoji: '✅',
    };
  } else if (percent >= 80) {
    return {
      verdict: "Likely enough - slight margin ✔️",
      confidence: 'medium-high',
      emoji: '✔️',
    };
  } else if (percent >= 60) {
    return {
      verdict: "Might not be enough - need some upsets ⚠️",
      confidence: 'medium',
      emoji: '⚠️',
    };
  } else {
    return {
      verdict: "Unlikely to be enough - must improve 🚨",
      confidence: 'low',
      emoji: '🚨',
    };
  }
}
