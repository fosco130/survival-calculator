// Calculate team strength rating for match simulation
// Phase 1 uses PPG + Form (xG comes in Phase 3)

import { SIMULATION_PARAMS } from '../data/constants';
import { parseFormToPoints, getMaxFormPoints } from '../utils/formParser';

export function calculateTeamStrength(team) {
  if (!team || !team.playedGames || team.playedGames === 0) {
    return 0.5; // Default neutral strength
  }

  // Points per game (50% weight in Phase 1)
  const ppg = team.points / team.playedGames;
  const ppgStrength = ppg * SIMULATION_PARAMS.WEIGHT_PPG_PHASE1;

  // Form: parse API form string (e.g. "W,L,D,W,W") for recent performance (30% weight in Phase 1)
  // Fallback to PPG-based estimate if form data not available
  let formStrength = 0;
  if (team.form) {
    const formPoints = parseFormToPoints(team.form);
    const maxFormPoints = getMaxFormPoints(team.form);
    formStrength =
      maxFormPoints > 0
        ? (formPoints / maxFormPoints) * SIMULATION_PARAMS.WEIGHT_FORM_PHASE1
        : 0;
  } else {
    // Fallback: estimate 30% of season PPG as recent form
    formStrength = ppg * 0.3 * SIMULATION_PARAMS.WEIGHT_FORM_PHASE1;
  }

  // Combine weighted scores
  const totalStrength = ppgStrength + formStrength;

  // Clamp to reasonable range (0.1 to 3.0)
  return Math.max(0.1, Math.min(3.0, totalStrength));
}

export function getStrengthForAllTeams(teams) {
  if (!teams || !Array.isArray(teams)) {
    return [];
  }

  return teams.map((team) => ({
    ...team,
    strength: calculateTeamStrength(team),
  }));
}

// Helper to normalize strength for debugging
export function getNormalizedStrength(team) {
  const strength = calculateTeamStrength(team);
  return strength / 2; // Normalize to roughly 0-1.5 range
}
