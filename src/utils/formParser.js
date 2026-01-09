/**
 * Parses API form string to calculate points
 * @param {string} formString - e.g. "W,L,D,W,W"
 * @returns {number} Total points (3 per W, 1 per D, 0 per L)
 */
export function parseFormToPoints(formString) {
  if (!formString) return null;

  const results = formString.split(',');
  let points = 0;

  results.forEach(result => {
    const trimmed = result.trim().toUpperCase();
    if (trimmed === 'W') points += 3;
    else if (trimmed === 'D') points += 1;
    // L = 0 points
  });

  return points;
}

/**
 * Gets maximum possible points for a form string
 * @param {string} formString - e.g. "W,L,D,W,W"
 * @returns {number} Maximum points if all wins
 */
export function getMaxFormPoints(formString) {
  if (!formString) return 18; // Default to 6 games * 3 points

  const gameCount = formString.split(',').length;
  return gameCount * 3;
}
