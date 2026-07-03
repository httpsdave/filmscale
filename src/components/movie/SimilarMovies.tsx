import { MovieRow } from '@/components/home/MovieRow';
import type { TMDBMovie } from '@/lib/types';

interface SimilarMoviesProps {
  movies: TMDBMovie[];
}

export function SimilarMovies({ movies }: SimilarMoviesProps) {
  if (!movies?.length) return null;

  return (
    <MovieRow
      title="Similar Movies"
      movies={movies}
      seeAllHref="/browse"
    />
  );
}
