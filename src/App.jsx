import { useEffect, useState } from 'react';
import { useStandings } from './hooks/useStandings';
import { useFixtures } from './hooks/useFixtures';
import { useSimulation } from './hooks/useSimulation';
import { useMultiTeamSimulation } from './hooks/useMultiTeamSimulation';
import { useUrlTeam } from './hooks/useUrlTeam';
import { getTeamBySlug } from './data/teams';
import SurvivalDisplay from './components/SurvivalDisplay';
import TeamSelector from './components/TeamSelector';
import RivalsPanel from './components/RivalsPanel';
import ScenarioBuilder from './components/ScenarioBuilder';
import ShareButtons from './components/ShareButtons';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import './App.css';

function App() {
  // Scenario builder state
  const [scenarios, setScenarios] = useState({});

  // URL-based team selection (defaults to Leeds)
  const [teamSlug, setTeamSlug] = useUrlTeam('leeds');
  const team = getTeamBySlug(teamSlug);

  // Fetch data from Netlify Functions
  const { data: standingsData, loading: loadingStandings, error: standingsError } = useStandings();
  const { data: fixturesData, loading: loadingFixtures, error: fixturesError } = useFixtures();

  // Extract arrays from API responses
  const standings = standingsData?.teams || null;
  const fixtures = fixturesData?.fixtures || null;

  // Run simulation with scenarios
  const { percentage, calculating } = useSimulation(team, standings, fixtures, scenarios);

  // Reset scenarios when team changes
  useEffect(() => {
    setScenarios({});
  }, [team?.id]);

  // Run multi-team simulation for rivals panel
  const { survivalPercentages } = useMultiTeamSimulation(standings, fixtures);

  // Get team standing
  const teamStanding = standings?.find((t) => t.id === team?.id) || null;

  const isLoading = loadingStandings || loadingFixtures;
  const hasError = standingsError || fixturesError;


  useEffect(() => {
    // Update page title with team name
    const teamName = team?.name || 'Premier League';
    const percentageStr = percentage ? ` - ${Math.round(percentage * 10) / 10}%` : '';
    document.title = `${teamName} Survival Odds${percentageStr} | Premier League Survival Calculator`;
  }, [team, percentage]);

  return (
    <div className="app-bg">
      {/* Header */}
      <header className="header">
        <div className="container-app py-8 md:py-12">
          <div className="header-content">
            <h1 className="header-title">Premier League Survival Calculator</h1>
            <p className="header-tagline">Calculate any team's relegation odds</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container-app py-8 md:py-12">
          {/* Team Selector */}
          {!isLoading && !hasError && standings && (
            <TeamSelector
              selectedTeamId={team?.id}
              onTeamSelect={setTeamSlug}
              standings={standings}
            />
          )}

          {isLoading && <LoadingSkeleton />}

          {hasError && (
            <ErrorState message={standingsError || fixturesError} />
          )}

          {!isLoading && !hasError && team && teamStanding && (
            <div className="content-wrapper">
              <SurvivalDisplay
                team={team}
                teamStanding={teamStanding}
                percentage={percentage}
                calculating={calculating}
                standings={standings}
              />

              {/* Scenario Builder - Test Fixtures */}
              <ScenarioBuilder
                team={team}
                fixtures={fixtures}
                percentage={percentage}
                onScenariosChange={setScenarios}
              />

              {/* Rivals Panel - Relegation Battle */}
              <RivalsPanel
                currentTeamId={team.id}
                standings={standings}
                survivalPercentages={survivalPercentages}
              />

              {/* Share Buttons */}
              <ShareButtons team={team} percentage={percentage} />
            </div>
          )}

          {!isLoading && !hasError && !team && (
            <ErrorState message="Team not found" />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container-app py-6 md:py-8">
          <div className="footer-content">
            <div className="footer-branding">
              <h3 className="footer-title">Powered by Leeds, That!</h3>
              <a
                href="https://leedsthat.com"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit leedsthat.com
              </a>
            </div>
            <p className="footer-copyright">
              &copy; 2026 Leeds, That! All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
