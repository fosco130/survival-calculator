import { useState, useEffect, useCallback } from 'react';
import { getTeamBySlug } from '../data/teams';

/**
 * Custom hook to manage team selection via URL parameters
 * Syncs team state with ?team=slug URL parameter
 *
 * @param {string} defaultSlug - Default team slug if no URL param or invalid slug
 * @returns {[string, function]} - [teamSlug, setTeamSlug]
 */
export function useUrlTeam(defaultSlug = 'leeds') {
  const [teamSlug, setTeamSlugState] = useState(() => {
    // Initialize from URL on mount
    const params = new URLSearchParams(window.location.search);
    const urlTeam = params.get('team');

    // Validate that the team exists
    if (urlTeam && getTeamBySlug(urlTeam)) {
      return urlTeam.toLowerCase();
    }
    return defaultSlug.toLowerCase();
  });

  // Wrapper around setTeamSlug that also updates URL
  const setTeamSlug = useCallback((newSlug) => {
    const normalizedSlug = newSlug.toLowerCase();

    // Validate team exists
    if (!getTeamBySlug(normalizedSlug)) {
      console.warn(`Team slug "${normalizedSlug}" not found, keeping current team`);
      return;
    }

    setTeamSlugState(normalizedSlug);

    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('team', normalizedSlug);
    window.history.replaceState({}, '', url);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlTeam = params.get('team');

      if (urlTeam && getTeamBySlug(urlTeam)) {
        setTeamSlugState(urlTeam.toLowerCase());
      } else {
        setTeamSlugState(defaultSlug.toLowerCase());
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultSlug]);

  return [teamSlug, setTeamSlug];
}
