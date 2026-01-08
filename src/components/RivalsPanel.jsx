import { getTeamById } from '../data/teams';
import { getSurvivalColor } from '../data/historicalThresholds';
import './RivalsPanel.css';

function RivalsPanel({ currentTeamId, standings, survivalPercentages = {} }) {
  if (!standings || standings.length === 0) {
    return null;
  }

  // Get teams in bottom 10 (potential relegation zone)
  // Start from position 11 or when we're within 8 points of 18th place
  const sortedStandings = [...standings].sort((a, b) => a.position - b.position);
  const lastPlace = sortedStandings[sortedStandings.length - 1];
  const cutoffPoints = lastPlace.points + 8;

  const rivalTeams = sortedStandings.filter(
    (s) => s.position >= 15 || s.points <= cutoffPoints
  );

  if (rivalTeams.length === 0) {
    return null;
  }

  return (
    <div className="rivals-panel">
      <div className="rivals-header">
        <h3 className="rivals-title">THE DEATH ZONE</h3>
        <p className="rivals-subtitle">Who's in the mud? ({rivalTeams.length} teams)</p>
      </div>

      <div className="rivals-table">
        {rivalTeams.map((standing) => {
          const team = getTeamById(standing.id);
          const survivalPercentage = survivalPercentages[standing.id] || 0.5;
          const survivalColor = getSurvivalColor(survivalPercentage);
          const isCurrentTeam = standing.id === currentTeamId;
          const isRellegationZone = standing.position >= 18;

          return (
            <div
              key={standing.id}
              className={`rival-row ${survivalColor} ${isCurrentTeam ? 'current' : ''} ${isRellegationZone ? 'relegation-zone' : ''}`}
            >
              {/* Current team indicator */}
              {isCurrentTeam && <div className="current-indicator">→</div>}

              {/* Position */}
              <div className="rival-position">{standing.position}</div>

              {/* Team badge and name */}
              <div className="rival-team">
                <div className="rival-badge-wrapper">
                  {standing.crest ? (
                    <img
                      src={standing.crest}
                      alt={`${standing.name} crest`}
                      className="rival-badge-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="rival-badge"
                    style={{
                      background: team?.colors?.primary || '#999',
                      color: team?.colors?.secondary || '#fff',
                      borderColor: team?.colors?.primary || '#999',
                      display: standing.crest ? 'none' : 'flex',
                    }}
                  >
                    {team?.shortName || '?'}
                  </div>
                </div>
                <div className="rival-name">{team?.name || 'Unknown'}</div>
              </div>

              {/* Points */}
              <div className="rival-points">{standing.points}</div>

              {/* Survival percentage bar */}
              <div className="rival-survival">
                <div className="survival-bar-container">
                  <div
                    className={`survival-bar ${survivalColor}`}
                    style={{
                      width: `${survivalPercentage * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="survival-percentage">{Math.round(survivalPercentage * 10) / 10}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RivalsPanel;
