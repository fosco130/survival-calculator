import './ProgressBar.css';

function ProgressBar({ percentage, color = 'nervous' }) {
  if (percentage === null || percentage === undefined) {
    return null;
  }

  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="progress-container">
      <div
        className={`progress-fill progress-${color}`}
        style={{
          width: `${clampedPercentage}%`,
        }}
      >
        <div className="progress-shimmer"></div>
      </div>
      <span className="progress-text">{Math.round(clampedPercentage)}%</span>
    </div>
  );
}

export default ProgressBar;
