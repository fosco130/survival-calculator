import './ErrorState.css';

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Something Went Wrong</h2>
      <p className="error-message">{message || 'Unable to load survival calculator data'}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
      <p className="error-hint">
        Please check your internet connection and try again. If the problem persists, please contact
        support.
      </p>
    </div>
  );
}

export default ErrorState;
