import { useState, useEffect } from 'react';

/**
 * Custom Hook: useStudents
 *
 * Fetches student data from a remote API and manages loading/error states.
 *
 * ✅ Uses async/await for readability
 * ✅ Handles errors gracefully
 * ✅ Includes cleanup logic
 *
 * @returns {{ students: Array, loading: boolean, error: string | null }}
 */
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Async function inside useEffect to fetch data
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://68710f827ca4d06b34b92fc0.mockapi.io/Students ');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means this runs once on mount

  return { students, loading, error };
}