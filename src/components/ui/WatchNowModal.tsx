'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

interface WatchNowModalProps {
  movieId: number;
  movieTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function WatchNowModal({ movieId, movieTitle, isOpen, onClose }: WatchNowModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-red-500 transition-colors"
          aria-label="Close player"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        {movieTitle && (
          <h3 className="text-white font-semibold mb-2 text-lg">{movieTitle}</h3>
        )}

        {/* Video Player */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl shadow-red-500/10">
          <iframe
            src={`https://www.vidking.net/embed/movie/${movieId}?color=ef4444&autoPlay=true`}
            title={movieTitle || 'Movie Player'}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

interface WatchNowButtonProps {
  movieId: number;
  movieTitle?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function WatchNowButton({ movieId, movieTitle, variant = 'primary', className }: WatchNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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
      </button>

      <WatchNowModal
        movieId={movieId}
        movieTitle={movieTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
