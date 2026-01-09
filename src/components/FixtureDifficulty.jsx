import { analyzeFixtures, getFixtureVerdict } from '../utils/fixtureAnalysis';
import { getThresholdLabel } from '../data/historicalThresholds';
import './FixtureDifficulty.css';

function FixtureDifficulty({ fixtures, teamId, standings, currentPoints }) {
  if (!fixtures || !standings) {
    return null;
  }

  const analysis = analyzeFixtures(fixtures, teamId, standings);

  if (analysis.breakdown.length === 0) {
    return null;
  }

  // Get safety threshold for current points
  const threshold = getThresholdLabel(currentPoints);
  const verdict = getFixtureVerdict(currentPoints + analysis.expectedPoints, threshold.points);

  return (
    <div className="fixture-difficulty">
      <h3 className="difficulty-title">📊 Fixture Analysis</h3>

      <div className="fixtures-list">
        {analysis.breakdown.map((fixture, index) => (
          <div key={fixture.fixtureId} className={`fixture-row difficulty-${fixture.difficulty.label.toLowerCase()}`}>
            <div className="fixture-position">
              <span className="position-number">{index + 1}</span>
            </div>

            <div className="fixture-info">
              <div className="fixture-opponent">
                <span className="opponent-name">{fixture.opponent.shortName || fixture.opponent.name}</span>
                <span className="opponent-position">(#{fixture.opponentPosition})</span>
              </div>
              <span className={`fixture-venue ${fixture.isHome ? 'home' : 'away'}`}>
                {fixture.isHome ? '🏠 Home' : '✈️ Away'}
              </span>
            </div>

            <div className="fixture-difficulty-badge">
              <span className="difficulty-emoji">{fixture.difficulty.emoji}</span>
              <span className="difficulty-label">{fixture.difficulty.label}</span>
            </div>

            <div className="expected-points">
              <span className="points-label">Expected:</span>
              <span className="points-value">{fixture.expectedPoints}</span>
              <span className="points-unit">pts</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fixture-summary">
        <div className="summary-row">
          <span className="summary-label">Total Expected Points:</span>
          <span className="summary-value">{analysis.expectedPoints}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Safety Threshold:</span>
          <span className="summary-value">{threshold.points}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Projected Total:</span>
          <span className="summary-value">
            {currentPoints + analysis.expectedPoints} pts
            {currentPoints + analysis.expectedPoints >= threshold.points && (
              <span className="summary-badge safe">✅ Safe</span>
            )}
            {currentPoints + analysis.expectedPoints < threshold.points && (
              <span className="summary-badge danger">⚠️ At Risk</span>
            )}
          </span>
        </div>

        <div className="fixture-verdict">
          <p className="verdict-text">{verdict.verdict}</p>
        </div>
      </div>
    </div>
  );
}

export default FixtureDifficulty;
