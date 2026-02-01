import { useState, useEffect, useCallback } from 'react';
import { api, Tag } from '@/lib/api';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTags();
      setTags(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = async (name: string, color?: string) => {
    try {
      const newTag = await api.createTag(name, color);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      throw err;
    }
  };

  const updateTag = async (id: string, name?: string, color?: string) => {
    try {
      const updated = await api.updateTag(id, name, color);
      setTags(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await api.deleteTag(id);
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
}
