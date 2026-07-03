'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MovieListItem, ListType } from '@/lib/types';

function getStorageKey(listType: ListType): string {
  return `filmscale_${listType}`;
}

function loadList(listType: ListType): MovieListItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey(listType));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(listType: ListType, items: MovieListItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(listType), JSON.stringify(items));
}

export function useLocalStorage(listType: ListType) {
  const [items, setItems] = useState<MovieListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(loadList(listType));
    setIsLoaded(true);
  }, [listType]);

  const addItem = useCallback((movie: MovieListItem) => {
    setItems(prev => {
      if (prev.some(item => item.id === movie.id)) return prev;
      const next = [{ ...movie, addedAt: Date.now() }, ...prev];
      saveList(listType, next);
      return next;
    });
  }, [listType]);

  const removeItem = useCallback((movieId: number) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== movieId);
      saveList(listType, next);
      return next;
    });
  }, [listType]);

  const toggleItem = useCallback((movie: MovieListItem) => {
    setItems(prev => {
      const exists = prev.some(item => item.id === movie.id);
      const next = exists
        ? prev.filter(item => item.id !== movie.id)
        : [{ ...movie, addedAt: Date.now() }, ...prev];
      saveList(listType, next);
      return next;
    });
  }, [listType]);

  const isInList = useCallback((movieId: number): boolean => {
    return items.some(item => item.id === movieId);
  }, [items]);

  return { items, isLoaded, addItem, removeItem, toggleItem, isInList };
}
