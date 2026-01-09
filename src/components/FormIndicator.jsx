import './FormIndicator.css';

function FormIndicator({ form }) {
  if (!form) {
    return null;
  }

  const results = form.split(',').map((result) => result.trim().toUpperCase());

  return (
    <div className="form-indicator">
      <label className="form-label">Recent Form:</label>
      <div className="form-badges">
        {results.map((result, index) => (
          <span
            key={index}
            className={`form-badge form-badge-${result.toLowerCase()}`}
            title={`Match ${results.length - index}: ${result}`}
          >
            {result}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FormIndicator;
