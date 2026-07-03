import type { Metadata } from 'next';
import { searchMulti } from '@/lib/tmdb';
import { SearchClient } from './SearchClient';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for movies, TV shows, and people.',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = typeof sp.q === 'string' ? sp.q : '';
  const page = typeof sp.page === 'string' ? parseInt(sp.page) : 1;

  let results = null;
  if (query.length >= 2) {
    results = await searchMulti(query, page);
  }

  return (
    <SearchClient
      query={query}
      results={results?.results || []}
      totalPages={results?.total_pages || 0}
      currentPage={page}
    />
  );
}
