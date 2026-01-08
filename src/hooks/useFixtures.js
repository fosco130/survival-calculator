import { useState, useEffect } from 'react';
import { useMockData, getMockFixtures } from '../lib/mockData';

export function useFixtures() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFixtures = async () => {
      try {
        setLoading(true);
        setError(null);

        let fixturesData;

        if (useMockData) {
          fixturesData = await getMockFixtures();
        } else {
          const response = await fetch('/api/get-fixtures');

          if (!response.ok) {
            throw new Error(
              `Failed to fetch fixtures: ${response.status} ${response.statusText}`
            );
          }

          fixturesData = await response.json();
        }

        if (isMounted) {
          setData(fixturesData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unknown error fetching fixtures');
          console.error('Error fetching fixtures:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFixtures();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
