'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/ui/MovieCard';
import { Pagination } from '@/components/ui/Pagination';
import { cn } from '@/lib/utils';
import type { TMDBMovie, Genre } from '@/lib/types';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'original_title.asc', label: 'A → Z' },
  { value: 'original_title.desc', label: 'Z → A' },
];

interface BrowseClientProps {
  initialMovies: TMDBMovie[];
  totalPages: number;
  currentPage: number;
  genres: Genre[];
  selectedGenre: string;
  selectedSort: string;
}

export function BrowseClient({
  initialMovies,
  totalPages,
  currentPage,
  genres,
  selectedGenre,
  selectedSort,
}: BrowseClientProps) {
  const router = useRouter();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === 'genre') {
      if (value) params.set('genre', value);
      if (selectedSort) params.set('sort', selectedSort);
    } else if (key === 'sort') {
      if (selectedGenre) params.set('genre', selectedGenre);
      if (value) params.set('sort', value);
    } else if (key === 'page') {
      if (selectedGenre) params.set('genre', selectedGenre);
      if (selectedSort) params.set('sort', selectedSort);
      if (value !== '1') params.set('page', value);
    }
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white mb-8">Browse Movies</h1>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => updateFilters('genre', '')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              !selectedGenre
                ? 'bg-film-accent text-white'
                : 'bg-film-card border border-film-border text-film-muted hover:border-film-accent hover:text-film-accent'
            )}
          >
            All Genres
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => updateFilters('genre', String(genre.id))}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedGenre === String(genre.id)
                  ? 'bg-film-accent text-white'
                  : 'bg-film-card border border-film-border text-film-muted hover:border-film-accent hover:text-film-accent'
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-film-muted">Sort by:</span>
          <select
            value={selectedSort}
            onChange={e => updateFilters('sort', e.target.value)}
            className="bg-film-card border border-film-border rounded-lg px-3 py-2 text-sm text-film-text focus:outline-none focus:border-film-accent cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Movies grid */}
        {initialMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {initialMovies.map(movie => (
              <div key={movie.id} className="flex justify-center">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-film-muted text-lg">No movies found for the selected filters.</p>
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
