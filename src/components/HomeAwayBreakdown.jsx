import './HomeAwayBreakdown.css';

function HomeAwayBreakdown({ homeRecord, awayRecord }) {
  if (!homeRecord || !awayRecord) {
    return null;
  }

  const homeWinRate = homeRecord.played > 0
    ? ((homeRecord.won / homeRecord.played) * 100).toFixed(0)
    : 0;

  const awayWinRate = awayRecord.played > 0
    ? ((awayRecord.won / awayRecord.played) * 100).toFixed(0)
    : 0;

  return (
    <div className="home-away-breakdown">
      <div className="performance-split">
        <div className="home-performance">
          <div className="performance-header">
            <span className="performance-emoji">🏠</span>
            <h4 className="performance-title">Home</h4>
          </div>
          <div className="performance-stats">
            <div className="stat-row">
              <span className="stat-label">Record:</span>
              <span className="stat-value">
                {homeRecord.won}-{homeRecord.draw}-{homeRecord.lost}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Points:</span>
              <span className="stat-value">{homeRecord.points}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Win Rate:</span>
              <span className="stat-value">{homeWinRate}%</span>
            </div>
          </div>
        </div>

        <div className="vs-divider">VS</div>

        <div className="away-performance">
          <div className="performance-header">
            <span className="performance-emoji">✈️</span>
            <h4 className="performance-title">Away</h4>
          </div>
          <div className="performance-stats">
            <div className="stat-row">
              <span className="stat-label">Record:</span>
              <span className="stat-value">
                {awayRecord.won}-{awayRecord.draw}-{awayRecord.lost}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Points:</span>
              <span className="stat-value">{awayRecord.points}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Win Rate:</span>
              <span className="stat-value">{awayWinRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="performance-insight">
        {homeRecord.points > awayRecord.points ? (
          <p className="insight-text">
            💪 Strong at home - protect your fortress
          </p>
        ) : awayRecord.points > homeRecord.points ? (
          <p className="insight-text">
            🚀 Dangerous on the road - wins everywhere
          </p>
        ) : (
          <p className="insight-text">
            ⚖️ Balanced performance - consistent everywhere
          </p>
        )}
      </div>
    </div>
  );
}

export default HomeAwayBreakdown;
