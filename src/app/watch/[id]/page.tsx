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
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return {
      title: `Watch ${movie.title} - FilmScale`,
      description: `Watch ${movie.title} online`,
    };
  } catch {
    return { title: 'Movie Not Found' };
  }
}

export default async function WatchPage({ params }: Props) {
  const { id } = await params;
  let movie;
  try {
    movie = await getMovieDetails(Number(id));
  } catch {
    notFound();
  }

  const omdb = movie.imdb_id ? await getOMDbByImdbId(movie.imdb_id) : null;

  const trailer = movie.videos?.results?.find(
    v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) || movie.videos?.results?.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <div className="animate-fade-in bg-film-dark min-h-screen pb-12">
      {/* Video Player Section */}
      <div className="w-full bg-black pt-20">
        <div className="max-w-[1800px] mx-auto w-full aspect-video relative shadow-2xl">
          <iframe
            src={`https://www.vidking.net/embed/movie/${id}?color=ef4444&autoPlay=true`}
            title={`Watch ${movie.title}`}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      
      {/* Rest of the movie info */}
      <MovieHero movie={movie} omdb={omdb} trailer={trailer} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-8 mt-12">
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
