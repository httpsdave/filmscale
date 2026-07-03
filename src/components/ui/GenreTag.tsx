import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GENRE_LIST } from '@/lib/constants';

interface GenreTagProps {
  genreId?: number;
  name?: string;
  className?: string;
  clickable?: boolean;
}

export function GenreTag({ genreId, name, className, clickable = true }: GenreTagProps) {
  const genreName = name || GENRE_LIST.find(g => g.id === genreId)?.name || 'Unknown';
  const genreSlug = genreId || GENRE_LIST.find(g => g.name === genreName)?.id;

  const classes = cn(
    'inline-block px-3 py-1 text-xs rounded-full border border-film-border text-film-muted',
    'transition-colors duration-200',
    clickable && 'hover:border-film-accent hover:text-film-accent cursor-pointer',
    className
  );

  if (clickable && genreSlug) {
    return (
      <Link href={`/browse?genre=${genreSlug}`} className={classes}>
        {genreName}
      </Link>
    );
  }

  return <span className={classes}>{genreName}</span>;
}
