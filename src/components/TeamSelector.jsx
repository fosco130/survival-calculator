import { getAllTeams, getTeamById } from '../data/teams';
import { getSurvivalColor } from '../data/historicalThresholds';
import './TeamSelector.css';

function TeamSelector({ selectedTeamId, onTeamSelect, standings }) {
  const allTeams = getAllTeams();

  const handleTeamClick = (teamSlug) => {
    onTeamSelect(teamSlug);
  };

  return (
    <div className="team-selector-wrapper">
      <div className="team-selector">
        {allTeams.map((team) => {
          // Find team standing if available
          const teamStanding = standings?.find((s) => s.id === team.id);
          const survivalColor = teamStanding
            ? getSurvivalColor(teamStanding.survivalPercentage || 0.5)
            : 'neutral';
          const isSelected = team.id === selectedTeamId;

          return (
            <button
              key={team.id}
              className={`team-badge-btn ${isSelected ? 'selected' : ''} ${survivalColor}`}
              onClick={() => handleTeamClick(team.slug)}
              title={team.name}
              style={{
                '--team-color': team.colors.primary,
                '--team-secondary': team.colors.secondary,
              }}
            >
              <div className="badge-content">
                <div className="badge-initials">{team.shortName}</div>
                {teamStanding && (
                  <div className="badge-position">{teamStanding.position}</div>
                )}
              </div>
              <div className="badge-tooltip">{team.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TeamSelector;
