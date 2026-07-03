export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Image size presets
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w185',
    medium: 'h632',
    original: 'original',
  },
} as const;

// Helper to build image URLs
export function tmdbImage(path: string | null | undefined, size: string): string {
  if (!path) return '/no-image.svg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// Genre ID → name mapping (TMDB movie genres)
export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const GENRE_LIST = Object.entries(GENRE_MAP).map(([id, name]) => ({
  id: Number(id),
  name,
}));

export const SITE_NAME = 'FilmScale';
export const SITE_DESCRIPTION = 'Your ultimate guide to the world of cinema. Discover movies, read reviews, watch trailers, and build your personal watchlist.';
export const SITE_AUTHOR = 'httpsdave';
export const SITE_AUTHOR_URL = 'https://github.com/httpsdave';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Browse', href: '/browse' },
  { label: 'Top Rated', href: '/top-rated' },
  { label: 'My Lists', href: '/my-lists' },
] as const;

export const FOOTER_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller',
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Browse Movies', href: '/browse' },
  { label: 'Top Rated', href: '/top-rated' },
  { label: 'My Lists', href: '/my-lists' },
  { label: 'Search', href: '/search' },
] as const;
