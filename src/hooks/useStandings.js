import { useState, useEffect } from 'react';
import { useMockData, getMockStandings } from '../lib/mockData';

export function useStandings(competitionCode = 'PL') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStandings = async () => {
      try {
        setLoading(true);
        setError(null);

        let standingsData;

        if (useMockData) {
          standingsData = await getMockStandings();
        } else {
          const response = await fetch(
            `/api/get-standings?competition=${encodeURIComponent(competitionCode)}`
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch standings: ${response.status} ${response.statusText}`
            );
          }

          standingsData = await response.json();
        }

        if (isMounted) {
          setData(standingsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unknown error fetching standings');
          console.error('❌ Error fetching standings:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStandings();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [competitionCode]);

  return { data, loading, error };
}
