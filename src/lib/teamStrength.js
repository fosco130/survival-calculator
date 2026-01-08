// Calculate team strength rating for match simulation
// Phase 1 uses PPG + Form (xG comes in Phase 3)

import { SIMULATION_PARAMS } from '../data/constants';

export function calculateTeamStrength(team) {
  if (!team || !team.playedGames || team.playedGames === 0) {
    return 0.5; // Default neutral strength
  }

  // Points per game (50% weight in Phase 1)
  const ppg = team.points / team.playedGames;
  const ppgStrength = ppg * SIMULATION_PARAMS.WEIGHT_PPG_PHASE1;

  // Form: points from last 6 games (30% weight in Phase 1)
  // Fallback to current PPG if last6 data not available
  const last6Points = team.last6Points || team.points;
  const last6Games = Math.min(team.playedGames, 6);
  const formStrength =
    last6Games > 0
      ? (last6Points / (last6Games * 3)) * SIMULATION_PARAMS.WEIGHT_FORM_PHASE1
      : 0;

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
