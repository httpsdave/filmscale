'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tmdbImage, IMAGE_SIZES, GENRE_MAP } from '@/lib/constants';
import { extractYear, cn } from '@/lib/utils';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { Pagination } from '@/components/ui/Pagination';
import type { TMDBMovie, TopRatedSortOption, ViewMode, Genre } from '@/lib/types';

interface TopRatedClientProps {
  initialMovies: TMDBMovie[];
  totalPages: number;
  currentPage: number;
  genres: Genre[];
  selectedGenre: string;
}

export function TopRatedClient({ initialMovies, totalPages, currentPage, genres, selectedGenre }: TopRatedClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<TopRatedSortOption>('rank');

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === 'genre') {
      if (value) params.set('genre', value);
    } else if (key === 'page') {
      if (selectedGenre) params.set('genre', selectedGenre);
      if (value !== '1') params.set('page', value);
    }
    router.push(`/top-rated?${params.toString()}`);
  };

  const sortedMovies = useMemo(() => {
    const movies = [...initialMovies];
    switch (sortBy) {
      case 'release_date':
        return movies.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      case 'trending':
      case 'popularity':
        return movies.sort((a, b) => b.popularity - a.popularity);
      case 'alphabetical':
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      case 'rank':
      default:
        return movies;
    }
  }, [initialMovies, sortBy]);

  const getRank = (index: number) => (currentPage - 1) * 20 + index + 1;

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Top Rated Movies</h1>
            <p className="text-film-muted text-sm mt-1">As rated by millions of users</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Genre dropdown */}
            <select
              value={selectedGenre}
              onChange={e => updateFilters('genre', e.target.value)}
              className="bg-film-card border border-film-border rounded-lg px-3 py-2 text-sm text-film-text focus:outline-none focus:border-film-accent cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as TopRatedSortOption)}
              className="bg-film-card border border-film-border rounded-lg px-3 py-2 text-sm text-film-text focus:outline-none focus:border-film-accent cursor-pointer"
            >
              <option value="rank">Rank</option>
              <option value="release_date">Release Date</option>
              <option value="popularity">Popularity</option>
              <option value="trending">Trending</option>
              <option value="alphabetical">Alphabetical</option>
            </select>

            {/* View toggle */}
            <div className="flex border border-film-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors cursor-pointer',
                  viewMode === 'grid' ? 'bg-film-accent text-white' : 'bg-film-card text-film-muted hover:text-white'
                )}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={cn(
                  'p-2 transition-colors cursor-pointer',
                  viewMode === 'compact' ? 'bg-film-accent text-white' : 'bg-film-card text-film-muted hover:text-white'
                )}
                aria-label="Compact view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Grid view */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedMovies.map((movie, index) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group flex gap-4 bg-film-card border border-film-border/30 rounded-xl p-3 hover:border-film-accent/30 hover:bg-film-card-hover transition-all"
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex items-start justify-center pt-1">
                  <span className="text-2xl font-black text-film-border group-hover:text-film-accent transition-colors">
                    {getRank(index)}
                  </span>
                </div>
                {/* Poster */}
                <div className="flex-shrink-0 w-[80px] aspect-[2/3] rounded-lg overflow-hidden bg-film-surface">
                  <Image
                    src={tmdbImage(movie.poster_path, IMAGE_SIZES.poster.small)}
                    alt={movie.title}
                    width={80}
                    height={120}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-semibold text-white group-hover:text-film-accent transition-colors line-clamp-2 text-sm">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-film-muted mt-1">{extractYear(movie.release_date)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <RatingBadge rating={movie.vote_average} size="sm" />
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {movie.genre_ids?.slice(0, 2).map(id => (
                      <span key={id} className="text-[10px] px-1.5 py-0.5 rounded border border-film-border text-film-muted">
                        {GENRE_MAP[id]}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Compact view */}
        {viewMode === 'compact' && (
          <div className="space-y-1">
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-[3rem_1fr_6rem_6rem] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-film-muted font-semibold">
              <span>Rank</span>
              <span>Title</span>
              <span className="text-right">Rating</span>
              <span className="text-right">Year</span>
            </div>
            {sortedMovies.map((movie, index) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group grid grid-cols-[3rem_1fr_6rem] sm:grid-cols-[3rem_1fr_6rem_6rem] gap-4 items-center px-4 py-3 rounded-lg hover:bg-film-card-hover transition-colors"
              >
                <span className="text-lg font-bold text-film-border group-hover:text-film-accent transition-colors">
                  {getRank(index)}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-12 flex-shrink-0 rounded overflow-hidden bg-film-surface">
                    <Image
                      src={tmdbImage(movie.poster_path, IMAGE_SIZES.poster.small)}
                      alt={movie.title}
                      width={32}
                      height={48}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <span className="font-medium text-white group-hover:text-film-accent transition-colors truncate text-sm">
                    {movie.title}
                  </span>
                </div>
                <div className="text-right">
                  <RatingBadge rating={movie.vote_average} size="sm" />
                </div>
                <span className="text-sm text-film-muted text-right hidden sm:block">
                  {extractYear(movie.release_date)}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => updateFilters('page', String(page))}
          />
        )}
      </div>
    </div>
  );
}

