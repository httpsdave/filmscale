import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[185px]">
      <Skeleton className="w-full aspect-[2/3] rounded-lg" />
      <Skeleton className="h-4 w-3/4 mt-2 rounded" />
      <Skeleton className="h-3 w-1/2 mt-1 rounded" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-film-card">
      <div className="absolute inset-0 skeleton" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <Skeleton className="h-6 w-32 mb-4 rounded" />
        <Skeleton className="h-12 w-96 max-w-full mb-4 rounded" />
        <Skeleton className="h-4 w-[500px] max-w-full mb-2 rounded" />
        <Skeleton className="h-4 w-[400px] max-w-full mb-6 rounded" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMovieRow() {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-56 mb-6 rounded" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonMovieDetail() {
  return (
    <div className="animate-fade-in">
      {/* Hero skeleton */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-film-card">
        <div className="absolute inset-0 skeleton" />
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-[300px] aspect-[2/3] rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-10 w-80 mb-4 rounded" />
            <Skeleton className="h-5 w-60 mb-4 rounded" />
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
            </div>
            <Skeleton className="h-4 w-full mb-2 rounded" />
            <Skeleton className="h-4 w-full mb-2 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
