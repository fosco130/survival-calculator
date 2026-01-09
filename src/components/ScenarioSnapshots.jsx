import { useState } from 'react';
import './ScenarioSnapshots.css';

function ScenarioSnapshots({ teamId, currentPercentage, scenarios }) {
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotName, setSnapshotName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleSaveSnapshot = () => {
    if (!snapshotName.trim()) {
      return;
    }

    const newSnapshot = {
      id: Date.now(),
      name: snapshotName.trim(),
      percentage: currentPercentage,
      scenarios: { ...scenarios },
      timestamp: new Date().toLocaleString(),
      teamId,
    };

    setSnapshots([...snapshots, newSnapshot]);
    setSnapshotName('');
    setShowNameInput(false);
  };

  const handleDeleteSnapshot = (id) => {
    setSnapshots(snapshots.filter((s) => s.id !== id));
  };

  const handleLoadSnapshot = (snapshot) => {
    // This would need to be passed up to parent to update scenarios
    // For now, we'll just show it's selected
    console.log('Load scenario:', snapshot);
  };

  if (snapshots.length === 0 && !showNameInput) {
    return null;
  }

  const scenarioCount = Object.keys(scenarios).length;

  return (
    <div className="scenario-snapshots">
      <h3 className="snapshots-title">💾 Scenario Snapshots</h3>
      <p className="snapshots-subtitle">Save and compare multiple predictions</p>

      {/* Save New Snapshot */}
      {!showNameInput && scenarioCount > 0 && (
        <button
          className="save-snapshot-btn"
          onClick={() => setShowNameInput(true)}
        >
          <span className="btn-icon">💾</span>
          <span className="btn-text">Save Current Scenario</span>
        </button>
      )}

      {showNameInput && (
        <div className="snapshot-input-group">
          <input
            type="text"
            className="snapshot-name-input"
            placeholder="e.g., 'Best Case', 'Realistic', 'Worst Case'"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveSnapshot()}
            autoFocus
          />
          <div className="input-buttons">
            <button
              className="input-btn confirm"
              onClick={handleSaveSnapshot}
              disabled={!snapshotName.trim()}
            >
              Save
            </button>
            <button
              className="input-btn cancel"
              onClick={() => {
                setShowNameInput(false);
                setSnapshotName('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Saved Snapshots List */}
      {snapshots.length > 0 && (
        <div className="snapshots-list">
          <h4 className="list-header">Saved Scenarios ({snapshots.length})</h4>
          <div className="snapshots-grid">
            {snapshots.map((snapshot, index) => (
              <div key={snapshot.id} className="snapshot-card">
                <div className="snapshot-rank">#{index + 1}</div>

                <h5 className="snapshot-name">{snapshot.name}</h5>

                <div className="snapshot-percentage">
                  {snapshot.percentage.toFixed(1)}%
                </div>

                <div className="snapshot-meta">
                  <span className="meta-label">Fixtures:</span>
                  <span className="meta-value">
                    {Object.keys(snapshot.scenarios).length}
                  </span>
                </div>

                <div className="snapshot-meta">
                  <span className="meta-label">Saved:</span>
                  <span className="meta-value">{snapshot.timestamp}</span>
                </div>

                <div className="snapshot-actions">
                  <button
                    className="action-btn load"
                    onClick={() => handleLoadSnapshot(snapshot)}
                    title="Load this scenario"
                  >
                    📂 Load
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteSnapshot(snapshot.id)}
                    title="Delete this snapshot"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison */}
          {snapshots.length >= 2 && (
            <div className="snapshots-comparison">
              <h4 className="comparison-header">Scenario Comparison</h4>

              <div className="comparison-table">
                <div className="table-row table-header">
                  <div className="table-cell scenario-name">Scenario</div>
                  <div className="table-cell scenario-percentage">Survival %</div>
                  <div className="table-cell scenario-diff">Difference</div>
                </div>

                {snapshots.map((snapshot) => {
                  const maxPercentage = Math.max(
                    ...snapshots.map((s) => s.percentage)
                  );
                  const diff = maxPercentage - snapshot.percentage;

                  return (
                    <div key={snapshot.id} className="table-row">
                      <div className="table-cell scenario-name">{snapshot.name}</div>
                      <div className="table-cell scenario-percentage">
                        {snapshot.percentage.toFixed(1)}%
                      </div>
                      <div className="table-cell scenario-diff">
                        {diff > 0 ? `-${diff.toFixed(1)}%` : 'Best'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="best-scenario">
                <span className="best-emoji">🎯</span>
                <span className="best-text">
                  Best case: {snapshots[0].name} ({Math.max(...snapshots.map((s) => s.percentage)).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {snapshots.length === 0 && !showNameInput && (
        <p className="empty-state">
          Create different fixture scenarios above, then save them here to compare
        </p>
      )}
    </div>
  );
}

export default ScenarioSnapshots;
