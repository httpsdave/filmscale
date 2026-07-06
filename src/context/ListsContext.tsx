'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNotifications } from '@/context/NotificationContext';
import type { MovieListItem } from '@/lib/types';

interface ListsContextType {
  favorites: MovieListItem[];
  watchlist: MovieListItem[];
  watched: MovieListItem[];
  isLoaded: boolean;
  toggleFavorite: (movie: MovieListItem) => void;
  toggleWatchlist: (movie: MovieListItem) => void;
  toggleWatched: (movie: MovieListItem) => void;
  isFavorite: (id: number) => boolean;
  isInWatchlist: (id: number) => boolean;
  isWatched: (id: number) => boolean;
  removeFavorite: (id: number) => void;
  removeFromWatchlist: (id: number) => void;
  removeWatched: (id: number) => void;
}

const ListsContext = createContext<ListsContextType | null>(null);

function buildActionMessage(action: 'added' | 'removed' | 'failed', listName: string, title: string) {
  if (action === 'failed') {
    return {
      kind: 'error' as const,
      title: `Could not update ${listName}`,
      message: 'Your browser storage may be unavailable. Try again.',
    };
  }

  return {
    kind: action === 'added' ? ('success' as const) : ('warning' as const),
    title: `${action === 'added' ? 'Added to' : 'Removed from'} ${listName}`,
    message: title,
  };
}

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const favHook = useLocalStorage('favorites');
  const watchHook = useLocalStorage('watchlist');
  const watchedHook = useLocalStorage('watched');
  const { showNotification } = useNotifications();

  const notifyListChange = useCallback((listName: string, movie: MovieListItem, action: 'added' | 'removed' | 'failed') => {
    const notification = buildActionMessage(action, listName, movie.title);
    showNotification(notification);
  }, [showNotification]);

  const toggleFavorite = useCallback((movie: MovieListItem) => {
    const existed = favHook.isInList(movie.id);
    const changed = favHook.toggleItem(movie);
    notifyListChange('Favorites', movie, changed ? (existed ? 'removed' : 'added') : 'failed');
  }, [favHook, notifyListChange]);

  const toggleWatchlist = useCallback((movie: MovieListItem) => {
    const existed = watchHook.isInList(movie.id);
    const changed = watchHook.toggleItem(movie);
    notifyListChange('Watchlist', movie, changed ? (existed ? 'removed' : 'added') : 'failed');
  }, [watchHook, notifyListChange]);

  const toggleWatched = useCallback((movie: MovieListItem) => {
    const existed = watchedHook.isInList(movie.id);
    const changed = watchedHook.toggleItem(movie);
    notifyListChange('Watched', movie, changed ? (existed ? 'removed' : 'added') : 'failed');
  }, [watchedHook, notifyListChange]);
  const isFavorite = useCallback((id: number) => favHook.isInList(id), [favHook]);
  const isInWatchlist = useCallback((id: number) => watchHook.isInList(id), [watchHook]);
  const isWatched = useCallback((id: number) => watchedHook.isInList(id), [watchedHook]);

  const removeFavorite = useCallback((id: number) => {
    const item = favHook.items.find(movie => movie.id === id);
    const changed = favHook.removeItem(id);
    if (item) notifyListChange('Favorites', item, changed ? 'removed' : 'failed');
  }, [favHook, notifyListChange]);

  const removeFromWatchlist = useCallback((id: number) => {
    const item = watchHook.items.find(movie => movie.id === id);
    const changed = watchHook.removeItem(id);
    if (item) notifyListChange('Watchlist', item, changed ? 'removed' : 'failed');
  }, [watchHook, notifyListChange]);

  const removeWatched = useCallback((id: number) => {
    const item = watchedHook.items.find(movie => movie.id === id);
    const changed = watchedHook.removeItem(id);
    if (item) notifyListChange('Watched', item, changed ? 'removed' : 'failed');
  }, [watchedHook, notifyListChange]);

  const value = useMemo(() => ({
    favorites: favHook.items,
    watchlist: watchHook.items,
    watched: watchedHook.items,
    isLoaded: favHook.isLoaded && watchHook.isLoaded && watchedHook.isLoaded,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    isFavorite,
    isInWatchlist,
    isWatched,
    removeFavorite,
    removeFromWatchlist,
    removeWatched,
  }), [favHook, watchHook, watchedHook, toggleFavorite, toggleWatchlist, toggleWatched, isFavorite, isInWatchlist, isWatched, removeFavorite, removeFromWatchlist, removeWatched]);

  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const ctx = useContext(ListsContext);
  if (!ctx) throw new Error('useLists must be used within ListsProvider');
  return ctx;
}
