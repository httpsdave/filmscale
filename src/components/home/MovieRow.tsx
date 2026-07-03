'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { MovieCard } from '@/components/ui/MovieCard';
import type { TMDBMovie } from '@/lib/types';

interface MovieRowProps {
  title: string;
  movies: TMDBMovie[];
  seeAllHref?: string;
}

export function MovieRow({ title, movies, seeAllHref }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!movies?.length) return null;

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white italic">{title}</h2>
        <div className="flex items-center gap-3">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-sm text-film-accent hover:text-film-accent-hover transition-colors font-medium"
            >
              See All
            </Link>
          )}
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-lg border border-film-border flex items-center justify-center text-film-muted hover:text-white hover:border-white transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-lg border border-film-border flex items-center justify-center text-film-muted hover:text-white hover:border-white transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-2"
      >
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
