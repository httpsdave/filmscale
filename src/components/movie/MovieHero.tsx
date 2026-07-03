'use client';

import Image from 'next/image';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { extractYear, formatRuntime, formatCurrency, getMetacriticColor, cn } from '@/lib/utils';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { GenreTag } from '@/components/ui/GenreTag';
import { TrailerButton } from '@/components/ui/TrailerModal';
import { useLists } from '@/context/ListsContext';
import type { TMDBMovieDetails, TMDBVideo, OMDbMovie } from '@/lib/types';
import { extractRottenTomatoesScore, extractMetacriticScore, extractImdbRating } from '@/lib/omdb';

interface MovieHeroProps {
  movie: TMDBMovieDetails;
  omdb: OMDbMovie | null;
  trailer?: TMDBVideo;
}

export function MovieHero({ movie, omdb, trailer }: MovieHeroProps) {
  const router = useRouter();
  const { toggleFavorite, toggleWatchlist, toggleWatched, isFavorite, isInWatchlist, isWatched } = useLists();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const listItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    addedAt: Date.now(),
  };

  const rtScore = extractRottenTomatoesScore(omdb);
  const metacritic = extractMetacriticScore(omdb);
  const imdbRating = extractImdbRating(omdb);

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative w-full h-[45vh] min-h-[350px]">
        <Image
          src={tmdbImage(movie.backdrop_path, IMAGE_SIZES.backdrop.original)}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-film-dark via-film-dark/60 to-film-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-film-dark/50 to-transparent" />
      </div>

      {/* Content overlapping backdrop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-56 relative z-10 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-[220px] sm:w-[260px] md:w-[300px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-film-border/30">
              <Image
                src={tmdbImage(movie.poster_path, IMAGE_SIZES.poster.large)}
                alt={movie.title}
                width={300}
                height={450}
                priority
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-film-muted italic text-sm sm:text-base mb-4">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-3 text-sm text-film-muted mb-4 flex-wrap">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {extractYear(movie.release_date)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatRuntime(movie.runtime)}
              </span>
              {omdb?.Rated && omdb.Rated !== 'N/A' && (
                <span className="px-2 py-0.5 text-xs border border-film-border rounded">
                  {omdb.Rated}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                {movie.spoken_languages?.[0]?.english_name || 'English'}
              </span>
            </div>

            {/* Genre tags */}
            <div className="flex gap-2 flex-wrap mb-5">
              {movie.genres?.map(genre => (
                <GenreTag key={genre.id} genreId={genre.id} name={genre.name} />
              ))}
            </div>

            {/* Rating cards */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-film-card border border-film-border">
                <span className="text-blue-400 text-lg">★</span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-film-muted">TMDB</div>
                  <div className="font-bold text-sm">{movie.vote_average.toFixed(1)}/10</div>
                </div>
              </div>
              {imdbRating && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-film-card border border-film-border">
                  <span className="bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded">IMDb</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-film-muted">IMDB</div>
                    <div className="font-bold text-sm">{imdbRating}/10</div>
                  </div>
                </div>
              )}
              {metacritic !== null && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-film-card border border-film-border">
                  <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded', getMetacriticColor(metacritic))}>
                    {metacritic}
                  </span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-film-muted">METACRITIC</div>
                    <div className="font-bold text-sm">{metacritic}/100</div>
                  </div>
                </div>
              )}
              {rtScore && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-film-card border border-film-border">
                  <span className="text-lg">🍅</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-film-muted">ROTTEN TOMATOES</div>
                    <div className="font-bold text-sm">{rtScore}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => toggleFavorite(listItem)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer',
                  isFavorite(movie.id)
                    ? 'border-film-accent bg-film-accent/10 text-film-accent'
                    : 'border-film-border text-film-muted hover:border-film-accent hover:text-film-accent'
                )}
              >
                <svg className="w-4 h-4" fill={isFavorite(movie.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Favorite
              </button>
              <button
                onClick={() => toggleWatchlist(listItem)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer',
                  isInWatchlist(movie.id)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-film-border text-film-muted hover:border-blue-500 hover:text-blue-400'
                )}
              >
                <svg className="w-4 h-4" fill={isInWatchlist(movie.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                Watchlist
              </button>
              <button
                onClick={() => toggleWatched(listItem)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer',
                  isWatched(movie.id)
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-film-border text-film-muted hover:border-green-500 hover:text-green-400'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Watched
              </button>
              {trailer && (
                <TrailerButton videoKey={trailer.key} title={trailer.name} variant="primary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

