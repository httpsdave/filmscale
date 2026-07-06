'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbImage, IMAGE_SIZES, GENRE_MAP } from '@/lib/constants';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { TrailerButton } from '@/components/ui/TrailerModal';
import { WatchNowButton } from '@/components/ui/WatchNowModal';
import type { TMDBMovie, TMDBVideo } from '@/lib/types';

interface HeroBannerProps {
  movies: TMDBMovie[];
  videos?: Record<number, TMDBVideo | undefined>;
}

export function HeroBanner({ movies, videos = {} }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const featured = movies.slice(0, 5);
  const movie = featured[currentIndex];

  const goTo = useCallback((index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((currentIndex + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex, featured.length, goTo]);

  if (!movie) return null;

  const trailer = videos[movie.id];

  return (
    <div className="relative w-full h-[75vh] min-h-[550px] max-h-[800px] overflow-hidden">
      {/* Backdrop image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={tmdbImage(movie.backdrop_path, IMAGE_SIZES.backdrop.original)}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-film-dark via-film-dark/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-film-dark/80 via-transparent to-transparent" />

      {/* Content */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Meta info */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <RatingBadge rating={movie.vote_average} size="md" />
            <span className="text-film-muted text-sm font-medium">
              {movie.release_date?.substring(0, 4)}
            </span>
            <span className="text-film-border">·</span>
            <div className="flex gap-2 flex-wrap">
              {movie.genre_ids?.slice(0, 3).map(id => (
                <span
                  key={id}
                  className="px-2.5 py-0.5 text-xs rounded-full border border-film-border/60 text-film-muted"
                >
                  {GENRE_MAP[id] || 'Unknown'}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 max-w-3xl leading-tight">
            {movie.title}
          </h1>

          {/* Overview */}
          <p className="text-film-muted text-sm sm:text-base max-w-xl mb-6 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <WatchNowButton movieId={movie.id} movieTitle={movie.title} variant="primary" />
            {trailer && (
              <TrailerButton videoKey={trailer.key} title={trailer.name} variant="primary" />
            )}
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-film-border text-film-text hover:border-white hover:text-white transition-all duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              More Info
            </Link>
          </div>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-8">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-film-accent' : 'w-4 bg-film-border hover:bg-film-muted'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
