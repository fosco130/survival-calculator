import { useState } from 'react';
import { getTeamById } from '../data/teams';
import FixtureDifficulty from './FixtureDifficulty';
import './ScenarioBuilder.css';

function ScenarioBuilder({ team, fixtures, percentage, standings, teamStanding, onScenariosChange }) {
  const [scenarios, setScenarios] = useState({});

  if (!team || !fixtures || fixtures.length === 0) {
    return null;
  }

  // Get next 6 fixtures for the team
  const teamFixtures = fixtures
    .filter((f) => f.status === 'SCHEDULED' && (f.homeTeam?.id === team.id || f.awayTeam?.id === team.id))
    .slice(0, 6);

  if (teamFixtures.length === 0) {
    return null;
  }

  const handleResultClick = (fixtureId, result) => {
    const newScenarios = { ...scenarios };

    if (newScenarios[fixtureId] === result) {
      // Toggle off if clicking same result
      delete newScenarios[fixtureId];
    } else {
      // Set new result
      newScenarios[fixtureId] = result;
    }

    setScenarios(newScenarios);
    onScenariosChange(newScenarios);
  };

  const handleClearAll = () => {
    setScenarios({});
    onScenariosChange({});
  };

  const getOpponentName = (fixture) => {
    if (fixture.homeTeam?.id === team.id) {
      return fixture.awayTeam?.name || 'Away';
    }
    return fixture.homeTeam?.name || 'Home';
  };

  const getOpponentBadgeColor = (fixture) => {
    const opponent =
      fixture.homeTeam?.id === team.id ? fixture.awayTeam : fixture.homeTeam;
    const opponentTeam = opponent ? getTeamById(opponent.id) : null;
    return opponentTeam?.colors?.primary || '#999';
  };

  const isHome = (fixture) => fixture.homeTeam?.id === team.id;

  return (
    <div className="scenario-builder">
      <div className="scenario-header">
        <h3 className="scenario-title">PICK YOUR POISON</h3>
        <p className="scenario-subtitle">Test your survival strategy ({teamFixtures.length} fixtures left)</p>
      </div>

      <div className="scenario-container">
        {teamFixtures.map((fixture) => {
          const opponent = getOpponentName(fixture);
          const opponentColor = getOpponentBadgeColor(fixture);
          const isHomeGame = isHome(fixture);
          const currentResult = scenarios[fixture.id];

          return (
            <div key={fixture.id} className="scenario-row">
              <div className="fixture-opponent">
                <div
                  className="opponent-indicator"
                  style={{
                    background: opponentColor,
                    borderColor: opponentColor,
                  }}
                >
                  {isHomeGame ? 'H' : 'A'}
                </div>
                <div className="opponent-info">
                  <div className="opponent-label">vs</div>
                  <div className="opponent-name">{opponent}</div>
                </div>
              </div>

              <div className="result-buttons">
                {isHomeGame ? (
                  <>
                    <button
                      className={`result-btn result-win ${
                        currentResult === 'HOME_WIN' ? 'active' : ''
                      }`}
                      onClick={() => handleResultClick(fixture.id, 'HOME_WIN')}
                      title="Win"
                    >
                      W
                    </button>
                    <button
                      className={`result-btn result-draw ${
                        currentResult === 'DRAW' ? 'active' : ''
                      }`}
                      onClick={() => handleResultClick(fixture.id, 'DRAW')}
                      title="Draw"
                    >
                      D
                    </button>
                    <button
                      className={`result-btn result-loss ${
                        currentResult === 'HOME_LOSS' ? 'active' : ''
                      }`}
                      onClick={() => handleResultClick(fixture.id, 'HOME_LOSS')}
                      title="Loss"
                    >
                      L
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`result-btn result-win ${
                        currentResult === 'AWAY_WIN' ? 'active' : ''
                      }`}
                      onClick={() => handleResultClick(fixture.id, 'AWAY_WIN')}
                      title="Win"
                    >
                      W
                    </button>
                    <button
                      className={`result-btn result-draw ${
                        currentResult === 'DRAW' ? 'active' : ''
                      }`}
                      onClick={() => handleResultClick(fixture.id, 'DRAW')}
                      title="Draw"
                    >
                      D
                    </button>
                    <button
                      className={`result-btn result-loss ${
                        currentResult === 'AWAY_LOSS' ? 'active' : ''
                      }`}
                      onClick={() => handleResultClick(fixture.id, 'AWAY_LOSS')}
                      title="Loss"
                    >
                      L
                    </button>
                  </>
                )}
              </div>

              {currentResult && (
                <button
                  className="clear-btn"
                  onClick={() => handleResultClick(fixture.id, currentResult)}
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(scenarios).length > 0 && (
        <div className="scenario-actions">
          <button className="reset-btn" onClick={handleClearAll}>
            Reset All
          </button>
        </div>
      )}

      {/* Fixture Difficulty Analysis */}
      {standings && teamStanding && (
        <FixtureDifficulty
          fixtures={teamFixtures}
          teamId={team.id}
          standings={standings}
          currentPoints={teamStanding.points}
        />
      )}
    </div>
  );
}

export default ScenarioBuilder;
