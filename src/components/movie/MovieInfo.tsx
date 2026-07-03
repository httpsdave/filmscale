import { formatCurrency } from '@/lib/utils';
import type { TMDBMovieDetails, OMDbMovie } from '@/lib/types';

interface MovieInfoProps {
  movie: TMDBMovieDetails;
  omdb: OMDbMovie | null;
}

export function MovieInfo({ movie, omdb }: MovieInfoProps) {
  const director = movie.credits?.crew?.find(c => c.job === 'Director');
  const writers = movie.credits?.crew
    ?.filter(c => c.department === 'Writing')
    ?.slice(0, 3)
    ?.map(w => w.name)
    ?.join(', ');

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Overview</h2>
        <p className="text-film-muted leading-relaxed">
          {omdb?.Plot && omdb.Plot !== 'N/A' ? omdb.Plot : movie.overview}
        </p>
      </div>

      {/* Director & Writers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(director || (omdb?.Director && omdb.Director !== 'N/A')) && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-film-muted mb-1">Director</h3>
            <p className="text-white font-medium">{director?.name || omdb?.Director}</p>
          </div>
        )}
        {(writers || (omdb?.Writer && omdb.Writer !== 'N/A')) && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-film-muted mb-1">Writers</h3>
            <p className="text-white font-medium">{writers || omdb?.Writer}</p>
          </div>
        )}
      </div>

      {/* Awards */}
      {omdb?.Awards && omdb.Awards !== 'N/A' && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-film-muted mb-1 flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Awards
          </h3>
          <p className="text-film-accent font-medium text-sm">{omdb.Awards}</p>
        </div>
      )}

      {/* Financial info */}
      {(movie.budget > 0 || movie.revenue > 0 || (omdb?.BoxOffice && omdb.BoxOffice !== 'N/A')) && (
        <div className="flex items-center gap-8 flex-wrap">
          {movie.budget > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-film-muted mb-1">Budget</h3>
              <p className="text-white font-medium flex items-center gap-1">
                <span className="text-green-400">$</span>
                {formatCurrency(movie.budget)}
              </p>
            </div>
          )}
          {movie.revenue > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-film-muted mb-1">Revenue</h3>
              <p className="text-white font-medium flex items-center gap-1">
                <span className="text-green-400">$</span>
                {formatCurrency(movie.revenue)}
              </p>
            </div>
          )}
          {omdb?.BoxOffice && omdb.BoxOffice !== 'N/A' && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-film-muted mb-1">Box Office</h3>
              <p className="text-white font-medium">{omdb.BoxOffice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
