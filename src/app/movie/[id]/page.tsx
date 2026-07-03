import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMovieDetails } from '@/lib/tmdb';
import { getOMDbByImdbId } from '@/lib/omdb';
import { MovieHero } from '@/components/movie/MovieHero';
import { MovieInfo } from '@/components/movie/MovieInfo';
import { CastSection } from '@/components/movie/CastSection';
import { TrailerSection } from '@/components/movie/TrailerSection';
import { ReviewsSection } from '@/components/movie/ReviewsSection';
import { SimilarMovies } from '@/components/movie/SimilarMovies';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return {
      title: movie.title,
      description: movie.overview,
    };
  } catch {
    return { title: 'Movie Not Found' };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  let movie;
  try {
    movie = await getMovieDetails(Number(id));
  } catch {
    notFound();
  }

  // Fetch OMDb data using the IMDB ID from TMDB
  const omdb = movie.imdb_id ? await getOMDbByImdbId(movie.imdb_id) : null;

  // Find the best trailer
  const trailer = movie.videos?.results?.find(
    v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) || movie.videos?.results?.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <div className="animate-fade-in">
      <MovieHero movie={movie} omdb={omdb} trailer={trailer} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-8">
        <MovieInfo movie={movie} omdb={omdb} />

        {movie.credits?.cast && (
          <CastSection cast={movie.credits.cast} />
        )}

        {movie.videos?.results && (
          <TrailerSection videos={movie.videos.results} />
        )}

        {movie.reviews?.results && (
          <ReviewsSection reviews={movie.reviews.results} />
        )}

        {movie.similar?.results && (
          <SimilarMovies movies={movie.similar.results} />
        )}
      </div>
    </div>
  );
}
