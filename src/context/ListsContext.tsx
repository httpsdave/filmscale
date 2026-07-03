'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const favHook = useLocalStorage('favorites');
  const watchHook = useLocalStorage('watchlist');
  const watchedHook = useLocalStorage('watched');

  const toggleFavorite = useCallback((movie: MovieListItem) => favHook.toggleItem(movie), [favHook]);
  const toggleWatchlist = useCallback((movie: MovieListItem) => watchHook.toggleItem(movie), [watchHook]);
  const toggleWatched = useCallback((movie: MovieListItem) => watchedHook.toggleItem(movie), [watchedHook]);
  const isFavorite = useCallback((id: number) => favHook.isInList(id), [favHook]);
  const isInWatchlist = useCallback((id: number) => watchHook.isInList(id), [watchHook]);
  const isWatched = useCallback((id: number) => watchedHook.isInList(id), [watchedHook]);

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
    removeFavorite: favHook.removeItem,
    removeFromWatchlist: watchHook.removeItem,
    removeWatched: watchedHook.removeItem,
  }), [favHook, watchHook, watchedHook, toggleFavorite, toggleWatchlist, toggleWatched, isFavorite, isInWatchlist, isWatched]);

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
