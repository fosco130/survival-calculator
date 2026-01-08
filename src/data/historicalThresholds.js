// Historical relegation survival data
// Points thresholds and their corresponding survival rates

export const historicalThresholds = {
  21: {
    points: 21,
    survivalRate: 0.10,
    label: 'Almost certain relegation',
    color: 'danger',
  },
  23: {
    points: 23,
    survivalRate: 0.25,
    label: 'Very risky',
    color: 'danger',
  },
  25: {
    points: 25,
    survivalRate: 0.40,
    label: 'High risk',
    color: 'danger',
  },
  27: {
    points: 27,
    survivalRate: 0.50,
    label: 'Risky territory',
    color: 'nervous',
  },
  29: {
    points: 29,
    survivalRate: 0.65,
    label: 'Contested territory',
    color: 'nervous',
  },
  31: {
    points: 31,
    survivalRate: 0.75,
    label: 'Nervous territory',
    color: 'nervous',
  },
  33: {
    points: 33,
    survivalRate: 0.85,
    label: 'Usually safe',
    color: 'nervous',
  },
  35: {
    points: 35,
    survivalRate: 0.92,
    label: 'Virtually safe',
    color: 'safe',
  },
  36: {
    points: 36,
    survivalRate: 0.95,
    label: 'Safe',
    color: 'safe',
  },
  37: {
    points: 37,
    survivalRate: 0.98,
    label: 'Definitely safe',
    color: 'safe',
  },
  38: {
    points: 38,
    survivalRate: 0.99,
    label: '100% safe historically',
    color: 'safe',
  },
};

export function getThresholdLabel(points) {
  if (points >= 38) return historicalThresholds[38];
  if (points >= 37) return historicalThresholds[37];
  if (points >= 36) return historicalThresholds[36];
  if (points >= 35) return historicalThresholds[35];
  if (points >= 33) return historicalThresholds[33];
  if (points >= 31) return historicalThresholds[31];
  if (points >= 29) return historicalThresholds[29];
  if (points >= 27) return historicalThresholds[27];
  if (points >= 25) return historicalThresholds[25];
  if (points >= 23) return historicalThresholds[23];
  return historicalThresholds[21];
}

export function getSurvivalColor(percentage) {
  if (percentage > 70) return 'safe';
  if (percentage > 40) return 'nervous';
  return 'danger';
}
