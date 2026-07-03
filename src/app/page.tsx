import { Suspense } from 'react';
import { getTrending, getNowPlaying, getPopular, getUpcoming, getMovieDetails } from '@/lib/tmdb';
import { HeroBanner } from '@/components/home/HeroBanner';
import { MovieRow } from '@/components/home/MovieRow';
import { SkeletonHero, SkeletonMovieRow } from '@/components/ui/Skeleton';
import type { TMDBVideo } from '@/lib/types';

export default async function HomePage() {
  const [trending, nowPlaying, popular, upcoming] = await Promise.all([
    getTrending('week'),
    getNowPlaying(),
    getPopular(),
    getUpcoming(),
  ]);

  // Fetch trailers for top 5 trending movies (for hero banner)
  const heroVideos: Record<number, TMDBVideo | undefined> = {};
  const top5 = trending.results.slice(0, 5);
  await Promise.all(
    top5.map(async (movie) => {
      try {
        const details = await getMovieDetails(movie.id);
        const trailer = details.videos?.results?.find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        if (trailer) heroVideos[movie.id] = trailer;
      } catch {
        // skip on error
      }
    })
  );

  return (
    <>
      <Suspense fallback={<SkeletonHero />}>
        <HeroBanner movies={trending.results} videos={heroVideos} />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<SkeletonMovieRow />}>
          <MovieRow
            title="Trending This Week"
            movies={trending.results}
            seeAllHref="/browse?sort=popularity.desc"
          />
        </Suspense>

        <Suspense fallback={<SkeletonMovieRow />}>
          <MovieRow
            title="Now Playing"
            movies={nowPlaying.results}
            seeAllHref="/browse?sort=release_date.desc"
          />
        </Suspense>

        <Suspense fallback={<SkeletonMovieRow />}>
          <MovieRow
            title="Popular"
            movies={popular.results}
            seeAllHref="/browse?sort=popularity.desc"
          />
        </Suspense>

        <Suspense fallback={<SkeletonMovieRow />}>
          <MovieRow
            title="Upcoming"
            movies={upcoming.results}
            seeAllHref="/browse?sort=release_date.desc"
          />
        </Suspense>
      </div>
    </>
  );
}
