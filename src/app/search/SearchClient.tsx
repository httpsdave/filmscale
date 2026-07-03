'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { extractYear, cn } from '@/lib/utils';
import { RatingBadge } from '@/components/ui/RatingBadge';
import type { TMDBSearchMultiResult } from '@/lib/types';

interface SearchClientProps {
  query: string;
  results: TMDBSearchMultiResult[];
  totalPages: number;
  currentPage: number;
}

export function SearchClient({ query, results, totalPages, currentPage }: SearchClientProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(query);
  const [filter, setFilter] = useState<'all' | 'movie' | 'person'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const filtered = filter === 'all'
    ? results
    : results.filter(r => r.media_type === filter);

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-film-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search movies, actors..."
              className="w-full pl-12 pr-4 py-4 bg-film-card border border-film-border rounded-xl text-film-text placeholder-film-muted focus:outline-none focus:border-film-accent text-lg transition-colors"
            />
          </div>
        </form>

        {query && (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">
              Results for &quot;{query}&quot;
            </h1>
            <p className="text-sm text-film-muted mb-6">{results.length} results found</p>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
              {(['all', 'movie', 'person'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    filter === type
                      ? 'bg-film-accent text-white'
                      : 'bg-film-card border border-film-border text-film-muted hover:text-white'
                  )}
                >
                  {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'People'}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="space-y-3">
              {filtered.map(result => (
                <Link
                  key={`${result.media_type}-${result.id}`}
                  href={result.media_type === 'person' ? `/person/${result.id}` : `/movie/${result.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-film-card border border-film-border/30 hover:border-film-accent/30 hover:bg-film-card-hover transition-all group"
                >
                  <div className={cn(
                    'flex-shrink-0 overflow-hidden bg-film-surface',
                    result.media_type === 'person'
                      ? 'w-14 h-14 rounded-full'
                      : 'w-12 h-[72px] rounded-lg'
                  )}>
                    <Image
                      src={tmdbImage(
                        result.media_type === 'person' ? result.profile_path : result.poster_path,
                        IMAGE_SIZES.poster.small
                      )}
                      alt={result.title || result.name || ''}
                      width={56}
                      height={72}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-film-accent transition-colors text-sm">
                      {result.title || result.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-film-surface text-film-muted uppercase font-semibold">
                        {result.media_type}
                      </span>
                      {result.media_type !== 'person' && result.release_date && (
                        <span className="text-xs text-film-muted">{extractYear(result.release_date)}</span>
                      )}
                      {result.media_type === 'person' && result.known_for_department && (
                        <span className="text-xs text-film-muted">{result.known_for_department}</span>
                      )}
                    </div>
                  </div>
                  {result.vote_average && result.vote_average > 0 && result.media_type !== 'person' && (
                    <RatingBadge rating={result.vote_average} size="sm" />
                  )}
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-film-muted">No results found.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`)}
              />
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-film-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">Search FilmScale</h2>
            <p className="text-film-muted">Find movies, actors, and more</p>
          </div>
        )}
      </div>
    </div>
  );
}

