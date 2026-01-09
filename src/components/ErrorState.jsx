import './ErrorState.css';

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-icon">💀</div>
      <h2 className="error-title">BOLLOCKS</h2>
      <p className="error-message">{message || 'Can\'t fetch the data right now. Try again in a minute.'}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
      <p className="error-hint">
        If this keeps happening, your fate might just be sealed.
      </p>
    </div>
  );
}

export default ErrorState;
