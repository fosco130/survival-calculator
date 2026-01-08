import { useState, useEffect, useCallback } from 'react';
import { runSurvivalSimulation, getTeamFixtures } from '../lib/simulation';

export function useSimulation(team, standings, fixtures, scenarios = {}) {
  const [percentage, setPercentage] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculate = useCallback(() => {
    if (!team || !standings || !fixtures) {
      return;
    }

    setCalculating(true);

    // Defer calculation to next tick to avoid blocking UI
    const timeoutId = setTimeout(() => {
      try {
        const result = runSurvivalSimulation(team, standings, fixtures, scenarios);
        setPercentage(result);
      } catch (error) {
        console.error('Error running simulation:', error);
        setPercentage(0);
      } finally {
        setCalculating(false);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
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
