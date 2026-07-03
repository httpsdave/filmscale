// ─── TMDB Types ───

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
  media_type?: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string; english_name: string }[];
  genres: Genre[];
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  // append_to_response fields
  credits?: TMDBCredits;
  videos?: { results: TMDBVideo[] };
  reviews?: TMDBReviewResponse;
  similar?: TMDBMovieListResponse;
  recommendations?: TMDBMovieListResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
  popularity: number;
  gender: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  popularity: number;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBReview {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface TMDBReviewResponse {
  page: number;
  results: TMDBReview[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieListResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
  imdb_id: string;
  adult: boolean;
  movie_credits?: {
    cast: TMDBPersonMovieCredit[];
    crew: TMDBPersonCrewCredit[];
  };
}

export interface TMDBPersonMovieCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  overview: string;
  genre_ids: number[];
}

export interface TMDBPersonCrewCredit {
  id: number;
  title: string;
  job: string;
  department: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  popularity: number;
}

export interface TMDBSearchMultiResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  // movie/tv fields
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  known_for_department?: string;
  popularity: number;
}

// ─── OMDb Types ───

export interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export interface OMDbRating {
  Source: string;
  Value: string;
}

// ─── Combined / App Types ───

export interface CombinedMovieDetails {
  tmdb: TMDBMovieDetails;
  omdb: OMDbMovie | null;
}

export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  addedAt: number;
}

export type ListType = 'favorites' | 'watchlist' | 'watched';

export type SortOption = 'popularity' | 'vote_average' | 'release_date' | 'title';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'compact';
export type TopRatedSortOption = 'rank' | 'release_date' | 'trending' | 'popularity' | 'alphabetical';
