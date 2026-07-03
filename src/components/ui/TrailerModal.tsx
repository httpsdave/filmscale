'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TrailerModalProps {
  videoKey: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ videoKey, title, isOpen, onClose }: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-film-accent transition-colors"
          aria-label="Close trailer"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        {title && (
          <h3 className="text-white font-semibold mb-2 text-lg">{title}</h3>
        )}

        {/* Video */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={title || 'Trailer'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

interface TrailerButtonProps {
  videoKey: string;
  title?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function TrailerButton({ videoKey, title, variant = 'primary', className }: TrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer',
          variant === 'primary'
            ? 'bg-film-accent hover:bg-film-accent-hover text-white px-6 py-3'
            : 'border border-film-border text-film-text hover:border-film-accent hover:text-film-accent px-4 py-2',
          className
        )}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        {variant === 'primary' ? 'Watch Trailer' : 'Trailer'}
      </button>

      <TrailerModal
        videoKey={videoKey}
        title={title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
