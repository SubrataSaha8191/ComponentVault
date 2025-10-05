import { useState, useEffect } from 'react';
import { Component } from '@/lib/firebase/types';

export function useComponents(filters?: {
  category?: string;
  framework?: string;
  sourceType?: string;
  authorId?: string;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}) {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComponents();
  }, [JSON.stringify(filters)]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters?.category) params.append('category', filters.category);
      if (filters?.framework) params.append('framework', filters.framework);
      if (filters?.sourceType) params.append('sourceType', filters.sourceType);
      if (filters?.authorId) params.append('authorId', filters.authorId);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.orderBy) params.append('orderBy', filters.orderBy);
      if (filters?.order) params.append('order', filters.order);

      const response = await fetch(`/api/components?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }

      const data = await response.json();
      setComponents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchComponents();

  return { components, loading, error, refresh };
}

export function useComponent(componentId: string | null) {
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!componentId) {
      setLoading(false);
      return;
    }

    fetchComponent();
  }, [componentId]);

  const fetchComponent = async () => {
    if (!componentId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/components?id=${componentId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch component');
      }

      const data = await response.json();
      setComponent(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchComponent();

  return { component, loading, error, refresh };
}
