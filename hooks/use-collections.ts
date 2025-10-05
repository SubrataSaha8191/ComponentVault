import { useState, useEffect } from 'react';
import { Collection } from '@/lib/firebase/types';

export function useCollections(userId: string | null) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchCollections();
  }, [userId]);

  const fetchCollections = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/collections?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      setCollections(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchCollections();

  return { collections, loading, error, refresh };
}

export function useCollection(collectionId: string | null) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId) {
      setLoading(false);
      return;
    }

    fetchCollection();
  }, [collectionId]);

  const fetchCollection = async () => {
    if (!collectionId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/collections?id=${collectionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }

      const data = await response.json();
      setCollection(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchCollection();

  return { collection, loading, error, refresh };
}
