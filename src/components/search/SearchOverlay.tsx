'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { extractYear } from '@/lib/utils';
import type { TMDBSearchMultiResult } from '@/lib/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBSearchMultiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  if (!isOpen) return null;

  const movies = results.filter(r => r.media_type === 'movie');
  const people = results.filter(r => r.media_type === 'person');

  return (
    <div className="fixed inset-0 z-[90] bg-black/85 animate-fade-in" onClick={onClose}>
      <div
        className="max-w-2xl mx-auto mt-20 px-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-film-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleChange(e.target.value)}
            placeholder="Search movies, actors..."
            className="w-full pl-12 pr-4 py-4 bg-film-card border border-film-border rounded-xl text-film-text placeholder-film-muted focus:outline-none focus:border-film-accent text-lg transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-film-muted hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        {(loading || results.length > 0) && (
          <div className="mt-4 bg-film-card border border-film-border rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-film-muted">
                <div className="inline-block w-6 h-6 border-2 border-film-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && movies.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs uppercase tracking-wider text-film-muted bg-film-surface font-semibold">Movies</div>
                {movies.slice(0, 6).map(item => (
                  <Link
                    key={item.id}
                    href={`/movie/${item.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-film-card-hover transition-colors"
                  >
                    <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-film-surface">
                      <Image
                        src={tmdbImage(item.poster_path, IMAGE_SIZES.poster.small)}
                        alt={item.title || ''}
                        width={40}
                        height={56}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-film-text truncate">{item.title}</p>
                      <p className="text-xs text-film-muted">{extractYear(item.release_date)} · Movie</p>
                    </div>
                    {item.vote_average ? (
                      <span className="text-xs font-bold text-yellow-400">★ {item.vote_average.toFixed(1)}</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}

            {!loading && people.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs uppercase tracking-wider text-film-muted bg-film-surface font-semibold">People</div>
                {people.slice(0, 4).map(item => (
                  <Link
                    key={item.id}
                    href={`/person/${item.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-film-card-hover transition-colors"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-film-surface">
                      <Image
                        src={tmdbImage(item.profile_path, IMAGE_SIZES.profile.small)}
                        alt={item.name || ''}
                        width={40}
                        height={40}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-film-text">{item.name}</p>
                      <p className="text-xs text-film-muted">{item.known_for_department || 'Person'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && query.length >= 2 && results.length > 0 && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block px-4 py-3 text-center text-sm text-film-accent hover:bg-film-card-hover transition-colors border-t border-film-border"
              >
                View all results for &quot;{query}&quot;
              </Link>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-film-muted text-sm">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

