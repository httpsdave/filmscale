import { cn, getRatingColor } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingBadge({ rating, size = 'sm', className }: RatingBadgeProps) {
  const colorClass = getRatingColor(rating);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-bold rounded-md bg-black/60',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

interface DetailedRatingProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}

export function DetailedRating({ label, value, icon, color }: DetailedRatingProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-3 rounded-lg border border-film-border bg-film-card/50',
      color
    )}>
      {icon && <div className="text-lg">{icon}</div>}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-film-muted">{label}</div>
        <div className="font-bold text-sm">{value}</div>
      </div>
    </div>
  );
}
