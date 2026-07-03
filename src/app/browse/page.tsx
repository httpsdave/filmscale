import type { Metadata } from 'next';
import { discoverMovies, getGenres } from '@/lib/tmdb';
import { BrowseClient } from './BrowseClient';

export const metadata: Metadata = {
  title: 'Browse Movies',
  description: 'Discover movies by genre, sort by popularity, rating, or release date.',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrowsePage({ searchParams }: Props) {
  const sp = await searchParams;
  const genre = typeof sp.genre === 'string' ? sp.genre : '';
  const sort = typeof sp.sort === 'string' ? sp.sort : 'popularity.desc';
  const page = typeof sp.page === 'string' ? parseInt(sp.page) : 1;

  const [movies, genres] = await Promise.all([
    discoverMovies({
      page,
      sort_by: sort,
      with_genres: genre || undefined,
      'vote_count.gte': '50',
    }),
    getGenres(),
  ]);

  return (
    <BrowseClient
      initialMovies={movies.results}
      totalPages={movies.total_pages}
      currentPage={page}
      genres={genres}
      selectedGenre={genre}
      selectedSort={sort}
    />
  );
}
