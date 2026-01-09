import { useEffect, useState } from 'react';

const STORAGE_KEY = 'survivalHistory';

/**
 * Hook to manage survival percentage history for a team
 * Stores in localStorage to persist across sessions
 */
export function useSurvivalHistory(teamId) {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allHistory = JSON.parse(stored);
        const teamHistory = allHistory[teamId] || [];
        setHistory(teamHistory);
      }
    } catch (err) {
      console.error('Error loading survival history:', err);
    }
  }, [teamId]);

  /**
   * Add a new entry to the history
   * @param {number} percentage - Current survival percentage
   * @param {number} matchweek - Current matchweek (optional, auto-calculated if not provided)
   */
  const addEntry = (percentage, matchweek = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allHistory = stored ? JSON.parse(stored) : {};

      if (!allHistory[teamId]) {
        allHistory[teamId] = [];
      }

      const teamHistory = allHistory[teamId];

      // Avoid duplicate entries (same percentage within 0.1%)
      const lastEntry = teamHistory[teamHistory.length - 1];
      if (lastEntry && Math.abs(lastEntry.percentage - percentage) < 0.1) {
        return;
      }

      // Auto-calculate matchweek if not provided (assume 38 total games)
      const week = matchweek || 38 - Math.ceil(Math.random() * 5); // Placeholder logic

      const entry = {
        timestamp: new Date().toISOString(),
        percentage: Math.round(percentage * 10) / 10,
        matchweek: week,
        daysSinceStart: Math.floor(
          (new Date() - new Date('2024-08-01')) / (1000 * 60 * 60 * 24)
        ),
      };

      allHistory[teamId] = [...teamHistory, entry];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
      setHistory([...teamHistory, entry]);
    } catch (err) {
      console.error('Error saving survival history:', err);
    }
  };

  /**
   * Clear history for a team
   */
  const clearHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allHistory = JSON.parse(stored);
        delete allHistory[teamId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
        setHistory([]);
      }
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  return { history, addEntry, clearHistory };
}
