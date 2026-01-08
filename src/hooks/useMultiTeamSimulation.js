import { useState, useEffect, useCallback } from 'react';
import { runSurvivalSimulation } from '../lib/simulation';
import { getTeamById } from '../data/teams';

/**
 * Runs survival simulations for multiple teams (bottom-10)
 * Returns an object mapping team IDs to their survival percentages
 */
export function useMultiTeamSimulation(standings, fixtures) {
  const [survivalPercentages, setSurvivalPercentages] = useState({});
  const [calculating, setCalculating] = useState(false);

  const calculate = useCallback(() => {
    if (!standings || !fixtures || standings.length === 0) {
      return;
    }

    setCalculating(true);

    // Defer calculation to avoid blocking UI
    const timeoutId = setTimeout(() => {
      try {
        const percentages = {};

        // Get bottom-10 teams (positions 11-20)
        const sortedStandings = [...standings].sort((a, b) => a.position - b.position);
        const bottomTeams = sortedStandings.slice(10); // Positions 11-20

        // Run simulation for each bottom team
        bottomTeams.forEach((standing) => {
          const team = getTeamById(standing.id);
          if (team) {
            try {
              const result = runSurvivalSimulation(team, standings, fixtures, {});
              percentages[standing.id] = result;
            } catch (error) {
              console.warn(`Error simulating team ${team.name}:`, error);
              percentages[standing.id] = 0.5; // Default to 50% on error
            }
          }
        });

        setSurvivalPercentages(percentages);
      } catch (error) {
        console.error('Error running multi-team simulation:', error);
      } finally {
        setCalculating(false);
      }
    }, 100); // Slight delay to avoid UI blocking

    return () => clearTimeout(timeoutId);
  }, [standings, fixtures]);

  // Recalculate when standings or fixtures change
  useEffect(() => {
    const cleanup = calculate();
    return cleanup;
  }, [calculate]);

  return { survivalPercentages, calculating };
}
