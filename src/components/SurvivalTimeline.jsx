import { useSurvivalHistory } from '../hooks/useSurvivalHistory';
import './SurvivalTimeline.css';

function SurvivalTimeline({ teamId, currentPercentage }) {
  const { history, clearHistory } = useSurvivalHistory(teamId);

  if (!history || history.length < 2) {
    return null;
  }

  const minPercentage = Math.min(...history.map((h) => h.percentage), currentPercentage);
  const maxPercentage = Math.max(...history.map((h) => h.percentage), currentPercentage);
  const range = maxPercentage - minPercentage || 1;

  // Calculate trend direction and change
  const firstPercentage = history[0].percentage;
  const lastPercentage = currentPercentage || history[history.length - 1].percentage;
  const change = lastPercentage - firstPercentage;
  const changePercent = ((change / firstPercentage) * 100).toFixed(1);
  const trendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

  // Map percentage to normalized position (0-100)
  const getNormalizedPosition = (percentage) => {
    if (range === 0) return 50;
    return ((percentage - minPercentage) / range) * 100;
  };

  return (
    <div className="survival-timeline">
      <div className="timeline-header">
        <h3 className="timeline-title">📈 Survival Journey</h3>
        <div className="timeline-stats">
          <div className="timeline-stat">
            <span className="stat-label">Change:</span>
            <span className={`stat-value trend-${trendDirection}`}>
              {change > 0 ? '+' : ''}
              {change.toFixed(1)}% ({changePercent}%)
            </span>
          </div>
          <button
            className="timeline-clear-btn"
            onClick={clearHistory}
            title="Clear history"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="timeline-chart">
        <div className="chart-background">
          {/* Safety zone indicator (35+ points historically safe) */}
          <div className="safety-zone">
            <span className="zone-label">75% Safe Zone</span>
          </div>
        </div>

        <div className="chart-points">
          {history.map((entry, index) => {
            const position = getNormalizedPosition(entry.percentage);
            const daysSinceFirst = entry.daysSinceStart - history[0].daysSinceStart;

            return (
              <div
                key={index}
                className="timeline-point"
                style={{
                  left: `${position}%`,
                }}
                title={`${entry.percentage}% - ${new Date(entry.timestamp).toLocaleDateString()}`}
              >
                <div className="point-dot"></div>
                <div className="point-label">{entry.percentage}%</div>
              </div>
            );
          })}

          {/* Current percentage as final point */}
          {currentPercentage !== null && (
            <div
              className="timeline-point current"
              style={{
                left: `${getNormalizedPosition(currentPercentage)}%`,
              }}
              title={`Current: ${currentPercentage.toFixed(1)}%`}
            >
              <div className="point-dot"></div>
              <div className="point-label current-label">Now: {currentPercentage.toFixed(1)}%</div>
            </div>
          )}
        </div>
      </div>

      <div className="timeline-footer">
        <p className="timeline-caption">
          {trendDirection === 'up' && '✅ Your odds have improved over time'}
          {trendDirection === 'down' && '⚠️ Your odds have worsened - need a turnaround'}
          {trendDirection === 'stable' && '➡️ Your odds have remained consistent'}
        </p>
        <p className="timeline-entries">
          {history.length} observations tracked
        </p>
      </div>
    </div>
  );
}

export default SurvivalTimeline;
