/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";

// T is the type of data we expect back (e.g., Book, Category[], etc.)
export const useFetch = <T>(
  apiCall: () => Promise<{ data: T }>, 
  dependencies: any[] = [] // Optional: re-fetch when these change
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
    // We spread dependencies here to ensure useCallback updates correctly
  }, [...dependencies]); 

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, setData, refresh: execute };
};