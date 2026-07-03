import { OMDB_BASE_URL } from './constants';
import type { OMDbMovie } from './types';

const API_KEY = process.env.OMDB_API_KEY!;

async function omdbFetch(params: Record<string, string>): Promise<OMDbMovie | null> {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 }, // cache for 24 hours - preserve rate limit
    });

    if (!res.ok) return null;

    const data: OMDbMovie = await res.json();
    if (data.Response === 'False') return null;

    return data;
  } catch {
    return null;
  }
}

/**
 * Get movie details from OMDb using IMDb ID
 */
export async function getOMDbByImdbId(imdbId: string): Promise<OMDbMovie | null> {
  if (!imdbId) return null;
  return omdbFetch({ i: imdbId, plot: 'full' });
}

/**
 * Extract Rotten Tomatoes score from OMDb Ratings array
 */
export function extractRottenTomatoesScore(omdbData: OMDbMovie | null): string | null {
  if (!omdbData?.Ratings) return null;
  const rt = omdbData.Ratings.find(r => r.Source === 'Rotten Tomatoes');
  return rt?.Value || null;
}

/**
 * Extract Metacritic score from OMDb data
 */
export function extractMetacriticScore(omdbData: OMDbMovie | null): number | null {
  if (!omdbData?.Metascore || omdbData.Metascore === 'N/A') return null;
  return parseInt(omdbData.Metascore);
}

/**
 * Extract IMDb rating from OMDb data
 */
export function extractImdbRating(omdbData: OMDbMovie | null): string | null {
  if (!omdbData?.imdbRating || omdbData.imdbRating === 'N/A') return null;
  return omdbData.imdbRating;
}
