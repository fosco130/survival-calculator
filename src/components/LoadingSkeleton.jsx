import './LoadingSkeleton.css';

function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      {/* Team Header Skeleton */}
      <div className="skeleton-team-header">
        <div className="skeleton-badge"></div>
        <div className="skeleton-team-name"></div>
      </div>

      {/* Survival Card Skeleton */}
      <div className="skeleton-card">
        {/* Percentage Skeleton */}
        <div className="skeleton-percentage"></div>

        {/* Label Skeleton */}
        <div className="skeleton-label"></div>

        {/* Progress Bar Skeleton */}
        <div className="skeleton-progress"></div>

        {/* Stats Skeleton */}
        <div className="skeleton-stats">
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
        </div>

        {/* Threshold Skeleton */}
        <div className="skeleton-threshold">
          <div className="skeleton-threshold-label"></div>
          <div className="skeleton-threshold-value"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
