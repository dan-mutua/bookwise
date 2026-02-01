import { useState, useEffect, useCallback } from 'react';
import { api, Bookmark, QueryBookmarkDto, CreateBookmarkDto, UpdateBookmarkDto } from '@/lib/api';

export function useBookmarks(query?: QueryBookmarkDto) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBookmarks(query);
      setBookmarks(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const createBookmark = async (data: CreateBookmarkDto) => {
    try {
      const newBookmark = await api.createBookmark(data);
      setBookmarks(prev => [newBookmark, ...prev]);
      return newBookmark;
    } catch (err) {
      throw err;
    }
  };

  const updateBookmark = async (id: string, data: UpdateBookmarkDto) => {
    try {
      const updated = await api.updateBookmark(id, data);
      setBookmarks(prev => prev.map(b => b.id === id ? updated : b));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await api.deleteBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;

    const optimisticUpdate = !bookmark.isFavorite;
    setBookmarks(prev => prev.map(b =>
      b.id === id ? { ...b, isFavorite: optimisticUpdate } : b
    ));

    try {
      await api.updateBookmark(id, { isFavorite: optimisticUpdate });
    } catch (err) {
      setBookmarks(prev => prev.map(b =>
        b.id === id ? { ...b, isFavorite: !optimisticUpdate } : b
      ));
      throw err;
    }
  };

  return {
    bookmarks,
    loading,
    error,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    refetch: fetchBookmarks,
  };
}
