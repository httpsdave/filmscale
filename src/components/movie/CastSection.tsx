import Image from 'next/image';
import Link from 'next/link';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import type { TMDBCastMember } from '@/lib/types';

interface CastSectionProps {
  cast: TMDBCastMember[];
}

export function CastSection({ cast }: CastSectionProps) {
  if (!cast?.length) return null;

  const displayCast = cast.slice(0, 12);

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-5">Cast</h2>
      <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
        {displayCast.map(member => (
          <Link
            key={member.id}
            href={`/person/${member.id}`}
            className="flex-shrink-0 w-[120px] group text-center"
          >
            <div className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden bg-film-card border-2 border-film-border group-hover:border-film-accent transition-colors">
              <Image
                src={tmdbImage(member.profile_path, IMAGE_SIZES.profile.small)}
                alt={member.name}
                width={100}
                height={100}
                className="w-full h-auto object-cover"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium text-white group-hover:text-film-accent transition-colors line-clamp-2">
              {member.name}
            </h3>
            <p className="text-xs text-film-muted line-clamp-2 mt-0.5">
              {member.character}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

