import { getAllTeams, getTeamById } from '../data/teams';
import { getSurvivalColor } from '../data/historicalThresholds';
import './TeamSelector.css';

function TeamSelector({ selectedTeamId, onTeamSelect, standings }) {
  const allTeams = getAllTeams();

  const handleTeamClick = (teamSlug) => {
    onTeamSelect(teamSlug);
  };

  // Sort teams: selected first, then by position
  const sortedTeams = [...allTeams].sort((a, b) => {
    // Selected team always first
    if (a.id === selectedTeamId) return -1;
    if (b.id === selectedTeamId) return 1;

    // Then sort by league position
    const aStanding = standings?.find((s) => s.id === a.id);
    const bStanding = standings?.find((s) => s.id === b.id);

    if (aStanding && bStanding) {
      return aStanding.position - bStanding.position;
    }

    return 0;
  });

  return (
    <div className="team-selector-wrapper">
      <div className="selector-header">
        <h2 className="selector-title">Select a Team</h2>
        <p className="selector-instructions">
          Choose any Premier League team to calculate their survival odds
        </p>
      </div>

      <div className="team-selector">
        {sortedTeams.map((team) => {
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
                {teamStanding?.crest ? (
                  <img
                    src={teamStanding.crest}
                    alt={`${team.name} crest`}
                    className="badge-crest"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="badge-initials" style={{ display: teamStanding?.crest ? 'none' : 'flex' }}>
                  {team.shortName}
                </div>
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
