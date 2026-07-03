'use client';

import Image from 'next/image';
import Link from 'next/link';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { extractYear } from '@/lib/utils';
import { RatingBadge } from './RatingBadge';
import { useLists } from '@/context/ListsContext';
import type { TMDBMovie } from '@/lib/types';

interface MovieCardProps {
  movie: TMDBMovie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const { toggleFavorite, toggleWatchlist, toggleWatched, isFavorite, isInWatchlist, isWatched } = useLists();

  const listItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    addedAt: Date.now(),
  };

  return (
    <div className="group flex-shrink-0 w-[150px] sm:w-[175px] lg:w-[185px]">
      <Link href={`/movie/${movie.id}`} className="block relative">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-film-card">
          <Image
            src={tmdbImage(movie.poster_path, IMAGE_SIZES.poster.medium)}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 175px, 185px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />

          {/* Rating badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2">
              <RatingBadge rating={movie.vote_average} />
            </div>
          )}

          {/* Hover overlay with action icons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <div className="flex gap-2" onClick={e => e.preventDefault()}>
              <button
                onClick={() => toggleFavorite(listItem)}
                className={`p-2 rounded-full transition-colors ${isFavorite(movie.id) ? 'bg-film-accent text-white' : 'bg-black/60 text-white hover:bg-film-accent'}`}
                title="Favorite"
              >
                <svg className="w-4 h-4" fill={isFavorite(movie.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button
                onClick={() => toggleWatchlist(listItem)}
                className={`p-2 rounded-full transition-colors ${isInWatchlist(movie.id) ? 'bg-blue-500 text-white' : 'bg-black/60 text-white hover:bg-blue-500'}`}
                title="Watchlist"
              >
                <svg className="w-4 h-4" fill={isInWatchlist(movie.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </button>
              <button
                onClick={() => toggleWatched(listItem)}
                className={`p-2 rounded-full transition-colors ${isWatched(movie.id) ? 'bg-green-500 text-white' : 'bg-black/60 text-white hover:bg-green-500'}`}
                title="Watched"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Title & year */}
      <Link href={`/movie/${movie.id}`}>
        <h3 className="mt-2 text-sm font-medium text-film-text line-clamp-2 hover:text-film-accent transition-colors">
          {movie.title}
        </h3>
      </Link>
      <p className="text-xs text-film-muted mt-0.5">{extractYear(movie.release_date)}</p>
    </div>
  );
}
