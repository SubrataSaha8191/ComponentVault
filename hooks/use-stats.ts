import { useState, useEffect } from 'react';

interface PlatformStats {
  totalCollections: number;
  publicCollections: number;
  totalComponents: number;
  trending: string;
}

export function useStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchStats();

  return { stats, loading, error, refresh };
}

export function useCollectionStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollectionStats();
  }, []);

  const fetchCollectionStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats?type=collections');

      if (!response.ok) {
        throw new Error('Failed to fetch collection statistics');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchCollectionStats();

  return { stats, loading, error, refresh };
}

export function useComponentStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComponentStats();
  }, []);

  const fetchComponentStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats?type=components');

      if (!response.ok) {
        throw new Error('Failed to fetch component statistics');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchComponentStats();

  return { stats, loading, error, refresh };
}