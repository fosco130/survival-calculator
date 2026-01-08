import { useState, useEffect, useCallback } from 'react';
import { runSurvivalSimulation, getTeamFixtures } from '../lib/simulation';

export function useSimulation(team, standings, fixtures, scenarios = null) {
  const [percentage, setPercentage] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const calculate = useCallback(() => {
    if (!team || !standings || !fixtures) {
      return;
    }

    setCalculating(true);
    setProgress({ current: 0, total: 0 });

    // Run simulation with progress tracking
    const simulationPromise = runSurvivalSimulation(
      team,
      standings,
      fixtures,
      scenarios || {},
      (current, total) => {
        setProgress({ current, total });
      }
    );

    // Handle both Promise and sync returns for backward compatibility
    Promise.resolve(simulationPromise)
      .then((result) => {
        setPercentage(result);
      })
      .catch((error) => {
        console.error('Error running simulation:', error);
        setPercentage(0);
      })
      .finally(() => {
        setCalculating(false);
        setProgress({ current: 0, total: 0 });
      });
  }, [team, standings, fixtures, scenarios]);

  // Recalculate when team, data, or scenarios change
  useEffect(() => {
    if (team && standings && fixtures) {
      calculate();
    }
  }, [team, standings, fixtures, calculate]);

  return {
    percentage,
    calculating,
    progress,
    recalculate: calculate,
  };
}

// Helper hook to get team fixtures
export function useTeamFixtures(teamId, fixtures) {
  const [teamFixtures, setTeamFixtures] = useState([]);

  useEffect(() => {
    if (teamId && fixtures) {
      const filtered = getTeamFixtures(teamId, fixtures);
      setTeamFixtures(filtered);
    } else {
      setTeamFixtures([]);
    }
  }, [teamId, fixtures]);

  return teamFixtures;
}
