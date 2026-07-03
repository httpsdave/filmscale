import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPersonDetails } from '@/lib/tmdb';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { formatDate, extractYear } from '@/lib/utils';
import { RatingBadge } from '@/components/ui/RatingBadge';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = await getPersonDetails(Number(id));
    return {
      title: person.name,
      description: person.biography?.substring(0, 160),
    };
  } catch {
    return { title: 'Person Not Found' };
  }
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;
  let person;
  try {
    person = await getPersonDetails(Number(id));
  } catch {
    notFound();
  }

  const filmography = person.movie_credits?.cast
    ?.filter(m => m.poster_path)
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.slice(0, 24);

  return (
    <div className="pt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full overflow-hidden border-4 border-film-border bg-film-card shadow-2xl">
              <Image
                src={tmdbImage(person.profile_path, IMAGE_SIZES.profile.medium)}
                alt={person.name}
                width={250}
                height={250}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 text-center md:text-left">
              {person.name}
            </h1>

            <div className="flex items-center gap-4 text-sm text-film-muted mb-4 flex-wrap justify-center md:justify-start">
              {person.known_for_department && (
                <span className="px-3 py-1 rounded-full bg-film-card border border-film-border text-xs">
                  {person.known_for_department}
                </span>
              )}
              {person.birthday && (
                <span>Born: {formatDate(person.birthday)}</span>
              )}
              {person.deathday && (
                <span>Died: {formatDate(person.deathday)}</span>
              )}
              {person.place_of_birth && (
                <span>{person.place_of_birth}</span>
              )}
            </div>

            {person.biography && (
              <div className="text-film-muted text-sm leading-relaxed max-w-3xl">
                {person.biography.split('\n').filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="mb-3">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filmography */}
        {filmography && filmography.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-5 italic">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filmography.map(movie => (
                <Link
                  key={`${movie.id}-${movie.character}`}
                  href={`/movie/${movie.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-film-card">
                    <Image
                      src={tmdbImage(movie.poster_path, IMAGE_SIZES.poster.medium)}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {movie.vote_average > 0 && (
                      <div className="absolute top-2 left-2">
                        <RatingBadge rating={movie.vote_average} />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-film-text group-hover:text-film-accent transition-colors line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-film-muted">{extractYear(movie.release_date)}</p>
                  {movie.character && (
                    <p className="text-xs text-film-muted italic">as {movie.character}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
