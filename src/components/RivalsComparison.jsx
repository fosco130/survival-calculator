import { useState } from 'react';
import { getTeamById } from '../data/teams';
import './RivalsComparison.css';

function RivalsComparison({ yourTeamId, standings, survivalPercentages }) {
  const [selectedRivalId, setSelectedRivalId] = useState(null);

  if (!standings || !survivalPercentages) {
    return null;
  }

  const yourTeam = standings.find((t) => t.id === yourTeamId);
  const yourPercentage = survivalPercentages[yourTeamId];
  const yourTeamData = getTeamById(yourTeamId);

  if (!yourTeam || !yourPercentage) {
    return null;
  }

  // Get rivals (teams around your position in relegation zone)
  const relegetionZone = standings.filter((t) => t.position >= 15);
  const potentialRivals = relegetionZone.filter((t) => t.id !== yourTeamId).slice(0, 5);

  if (potentialRivals.length === 0) {
    return null;
  }

  // Select first rival as default, or use selected rival
  const rival =
    selectedRivalId && standings.find((t) => t.id === selectedRivalId)
      ? standings.find((t) => t.id === selectedRivalId)
      : potentialRivals[0];

  const rivalPercentage = survivalPercentages[rival.id] || 50;
  const difference = Math.abs(yourPercentage - rivalPercentage);
  const youreAhead = yourPercentage > rivalPercentage;

  // Generate comparison message
  let message = '';
  if (difference > 30) {
    if (youreAhead) {
      message = `🎯 You're ${difference.toFixed(1)}% more likely to stay up. You're laughing!`;
    } else {
      message = `⚠️ ${rival.name} is ${difference.toFixed(1)}% more likely to survive. Not good.`;
    }
  } else if (difference > 10) {
    message = `⚔️ Close battle for survival - only ${difference.toFixed(1)}% separates you`;
  } else {
    message = `🤝 You're almost level - could go either way`;
  }

  return (
    <div className="rivals-comparison">
      <h3 className="comparison-title">⚔️ Head-to-Head Showdown</h3>

      <div className="comparison-container">
        {/* Your Team */}
        <div className="team-card your-team">
          <div className="card-badge" style={{ background: yourTeamData?.colors.primary }}>
            {yourTeam.shortName}
          </div>
          <h4 className="card-team-name">{yourTeam.name}</h4>
          <div className="card-position">#{yourTeam.position}</div>
          <div className="card-percentage">{yourPercentage.toFixed(1)}%</div>
          <div className="card-context">
            <span className="context-label">Points:</span>
            <span className="context-value">{yourTeam.points}</span>
          </div>
        </div>

        {/* VS */}
        <div className="vs-indicator">
          <span className="vs-text">VS</span>
          <span className="vs-icon">⚔️</span>
        </div>

        {/* Rival Team */}
        <div className="team-card rival-team">
          <div className="card-badge" style={{ background: rival.colors?.primary || '#999' }}>
            {rival.shortName}
          </div>
          <h4 className="card-team-name">{rival.name}</h4>
          <div className="card-position">#{rival.position}</div>
          <div className="card-percentage">{rivalPercentage.toFixed(1)}%</div>
          <div className="card-context">
            <span className="context-label">Points:</span>
            <span className="context-value">{rival.points}</span>
          </div>
        </div>
      </div>

      {/* Comparison Message */}
      <div className={`comparison-message ${youreAhead ? 'winning' : 'losing'}`}>
        <p className="message-text">{message}</p>
      </div>

      {/* Rival Selector (if multiple rivals available) */}
      {potentialRivals.length > 1 && (
        <div className="rival-selector">
          <label className="selector-label">Compare with other rivals:</label>
          <div className="rival-buttons">
            {potentialRivals.map((r) => (
              <button
                key={r.id}
                className={`rival-btn ${selectedRivalId === r.id || (!selectedRivalId && r.id === potentialRivals[0].id) ? 'active' : ''}`}
                onClick={() => setSelectedRivalId(r.id)}
              >
                {r.shortName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Breakdown */}
      <div className="comparison-stats">
        <div className="stat-section">
          <h5 className="stat-section-title">Your Advantage</h5>
          <div className="stat-bar-container">
            <div
              className="stat-bar you"
              style={{
                width: `${(yourPercentage / (yourPercentage + rivalPercentage)) * 100}%`,
              }}
            >
              <span className="bar-percentage">{yourPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h5 className="stat-section-title">Their Advantage</h5>
          <div className="stat-bar-container">
            <div
              className="stat-bar rival"
              style={{
                width: `${(rivalPercentage / (yourPercentage + rivalPercentage)) * 100}%`,
              }}
            >
              <span className="bar-percentage">{rivalPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RivalsComparison;
