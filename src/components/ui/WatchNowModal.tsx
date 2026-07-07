import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

interface WatchNowButtonProps {
  movieId: number;
  movieTitle?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function WatchNowButton({ movieId, movieTitle, variant = 'primary', className }: WatchNowButtonProps) {
  return (
    <Link
      href={`/watch/${movieId}`}
      className={cn(
        'inline-flex items-center gap-2 font-bold rounded-lg transition-all duration-200 cursor-pointer',
        variant === 'primary' && 'bg-white hover:bg-white/90 text-black px-6 py-3',
        variant === 'accent' && 'bg-film-accent hover:bg-film-accent-hover text-white px-6 py-3',
        variant === 'secondary' && 'border border-film-border text-film-text hover:border-white hover:text-white px-4 py-2',
        className
      )}
    >
      <PlayCircle className="w-5 h-5 text-red-600" />
      Watch Now
    </Link>
  );
}
