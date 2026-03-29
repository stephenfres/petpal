import { useState, useEffect } from 'react';

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dependenciesKey = JSON.stringify(dependencies);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFunction();
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, dependenciesKey]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction();
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch, setData };
};

export const useMutation = (mutationFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mutationFunction(...args);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
