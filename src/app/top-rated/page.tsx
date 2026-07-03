import type { Metadata } from 'next';
import { discoverMovies, getGenres } from '@/lib/tmdb';
import { TopRatedClient } from './TopRatedClient';

export const metadata: Metadata = {
  title: 'Top Rated Movies',
  description: 'The highest rated movies of all time, ranked and sortable.',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TopRatedPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = typeof sp.page === 'string' ? parseInt(sp.page) : 1;
  const genre = typeof sp.genre === 'string' ? sp.genre : '';

  const [movies, genres] = await Promise.all([
    discoverMovies({
      page,
      sort_by: 'vote_average.desc',
      'vote_count.gte': '300',
      with_genres: genre || undefined,
    }),
    getGenres()
  ]);

  return (
    <TopRatedClient
      initialMovies={movies.results}
      totalPages={movies.total_pages}
      currentPage={page}
      genres={genres}
      selectedGenre={genre}
    />
  );
}
