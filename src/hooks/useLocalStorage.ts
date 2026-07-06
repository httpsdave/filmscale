'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

function saveList(listType: ListType, items: MovieListItem[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(getStorageKey(listType), JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function useLocalStorage(listType: ListType) {
  const [items, setItems] = useState<MovieListItem[]>([]);
  const itemsRef = useRef<MovieListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadList(listType);
    setItems(loaded);
    itemsRef.current = loaded;
    setIsLoaded(true);
  }, [listType]);

  const addItem = useCallback((movie: MovieListItem): boolean => {
    const prev = itemsRef.current;
    if (prev.some(item => item.id === movie.id)) return false;
    
    const next = [{ ...movie, addedAt: Date.now() }, ...prev];
    const didChange = saveList(listType, next);
    if (didChange) {
      itemsRef.current = next;
      setItems(next);
    }
    return didChange;
  }, [listType]);

  const removeItem = useCallback((movieId: number): boolean => {
    const prev = itemsRef.current;
    const next = prev.filter(item => item.id !== movieId);
    if (next.length === prev.length) return false;
    
    const didChange = saveList(listType, next);
    if (didChange) {
      itemsRef.current = next;
      setItems(next);
    }
    return didChange;
  }, [listType]);

  const toggleItem = useCallback((movie: MovieListItem): boolean => {
    const prev = itemsRef.current;
    const exists = prev.some(item => item.id === movie.id);
    const next = exists
      ? prev.filter(item => item.id !== movie.id)
      : [{ ...movie, addedAt: Date.now() }, ...prev];
      
    const didChange = saveList(listType, next);
    if (didChange) {
      itemsRef.current = next;
      setItems(next);
    }
    return didChange;
  }, [listType]);

  const isInList = useCallback((movieId: number): boolean => {
    return itemsRef.current.some(item => item.id === movieId);
  }, []);

  return { items, isLoaded, addItem, removeItem, toggleItem, isInList };
}
