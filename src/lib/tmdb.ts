import { TMDB_BASE_URL } from './constants';
import type {
  TMDBMovieDetails,
  TMDBMovieListResponse,
  TMDBPerson,
  TMDBSearchMultiResult,
  Genre,
} from './types';

const READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN!;

async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ─── Movie Lists ───

export async function getTrending(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<TMDBMovieListResponse> {
  return tmdbFetch(`/trending/movie/${timeWindow}`, { page: String(page) });
}

export async function getNowPlaying(page = 1): Promise<TMDBMovieListResponse> {
  return tmdbFetch('/movie/now_playing', { page: String(page), language: 'en-US' });
}

export async function getPopular(page = 1): Promise<TMDBMovieListResponse> {
  return tmdbFetch('/movie/popular', { page: String(page), language: 'en-US' });
}

export async function getUpcoming(page = 1): Promise<TMDBMovieListResponse> {
  return tmdbFetch('/movie/upcoming', { page: String(page), language: 'en-US' });
}

export async function getTopRated(page = 1): Promise<TMDBMovieListResponse> {
  return tmdbFetch('/movie/top_rated', { page: String(page), language: 'en-US' });
}

// ─── Movie Details ───

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  return tmdbFetch(`/movie/${movieId}`, {
    language: 'en-US',
    append_to_response: 'credits,videos,reviews,similar,recommendations',
  });
}

// ─── Person ───

export async function getPersonDetails(personId: number): Promise<TMDBPerson> {
  return tmdbFetch(`/person/${personId}`, {
    language: 'en-US',
    append_to_response: 'movie_credits',
  });
}

// ─── Search ───

export async function searchMulti(query: string, page = 1): Promise<{ page: number; results: TMDBSearchMultiResult[]; total_pages: number; total_results: number }> {
  return tmdbFetch('/search/multi', { query, page: String(page), language: 'en-US', include_adult: 'false' });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBMovieListResponse> {
  return tmdbFetch('/search/movie', { query, page: String(page), language: 'en-US', include_adult: 'false' });
}

// ─── Discover ───

export async function discoverMovies(params: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  year?: string;
  'vote_average.gte'?: string;
  'vote_count.gte'?: string;
}): Promise<TMDBMovieListResponse> {
  const queryParams: Record<string, string> = { language: 'en-US' };
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryParams[key] = String(value);
  });
  return tmdbFetch('/discover/movie', queryParams);
}

// ─── Genres ───

export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list', { language: 'en-US' });
  return data.genres;
}

// ─── Get movies by IDs (for user lists) ───

export async function getMoviesByIds(ids: number[]): Promise<TMDBMovieDetails[]> {
  const movies = await Promise.all(
    ids.map(async (id) => {
      try {
        return await tmdbFetch<TMDBMovieDetails>(`/movie/${id}`, { language: 'en-US' });
      } catch {
        return null;
      }
    })
  );
  return movies.filter((m): m is TMDBMovieDetails => m !== null);
}
