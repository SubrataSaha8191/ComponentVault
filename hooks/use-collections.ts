import { useState, useEffect } from 'react';
import { Collection } from '@/lib/firebase/types';

export function useCollections(userId: string | null) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, [userId]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (userId) {
        params.append('userId', userId);
        params.append('type', 'user');
      }

      const response = await fetch(`/api/collections?${params.toString()}`);

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

export function useAllCollections(filters?: {
  userId?: string | null;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCollections();
  }, [JSON.stringify(filters)]);

  const fetchAllCollections = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.orderBy) params.append('orderBy', filters.orderBy);
      if (filters?.order) params.append('order', filters.order);

      const response = await fetch(`/api/collections?${params.toString()}`);

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

  const refresh = () => fetchAllCollections();

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
