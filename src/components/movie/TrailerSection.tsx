import type { TMDBVideo } from '@/lib/types';

interface TrailerSectionProps {
  videos: TMDBVideo[];
}

export function TrailerSection({ videos }: TrailerSectionProps) {
  const trailers = videos
    ?.filter(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
    ?.slice(0, 3);

  if (!trailers?.length) return null;

  const mainTrailer = trailers[0];

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <svg className="w-6 h-6 text-film-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        Trailer
      </h2>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-film-card border border-film-border/30">
        <iframe
          src={`https://www.youtube.com/embed/${mainTrailer.key}?rel=0`}
          title={mainTrailer.name}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Additional trailers */}
      {trailers.length > 1 && (
        <div className="flex gap-4 mt-4 overflow-x-auto hide-scrollbar">
          {trailers.slice(1).map(video => (
            <div key={video.id} className="flex-shrink-0 w-[280px]">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-film-card border border-film-border/30">
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}?rel=0`}
                  title={video.name}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-1 text-xs text-film-muted truncate">{video.name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
