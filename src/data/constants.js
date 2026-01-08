// Simulation engine constants and parameters

export const SIMULATION_PARAMS = {
  ITERATIONS: 10000,
  HOME_ADVANTAGE: 0.1,

  // Strength rating weights
  WEIGHT_XG: 0.4,           // xG data (Phase 3)
  WEIGHT_PPG: 0.3,          // Points per game
  WEIGHT_FORM: 0.2,         // Last 6 games
  WEIGHT_HOME: 0.1,         // Home advantage adjustment

  // Phase 1: Simplified weights (without xG)
  WEIGHT_PPG_PHASE1: 0.5,
  WEIGHT_FORM_PHASE1: 0.3,
  WEIGHT_HOME_PHASE1: 0.2,
};

export const MATCH_PROBABILITIES = {
  BASE_HOME_WIN: 0.35,
  BASE_DRAW: 0.28,
  MIN_HOME_WIN: 0.15,
  MAX_HOME_WIN: 0.85,
  MIN_DRAW: 0.15,
  STRENGTH_MULTIPLIER: 0.15,
  DRAW_STRENGTH_IMPACT: 0.05,
};

export const RELEGATION_THRESHOLDS = {
  SAFE_POSITION: 17,
  MINIMUM_POINTS: 21,
  TYPICAL_SURVIVAL: 35,
};

export const ANIMATION_TIMINGS = {
  COUNT_UP_DURATION: 400,
  PROGRESS_BAR_DURATION: 600,
  FADE_IN_DURATION: 400,
  SELECTION_DURATION: 300,
};

export const CACHE_SETTINGS = {
  STANDINGS_TTL: 3600000, // 1 hour
  FIXTURES_TTL: 3600000,  // 1 hour
};
