'use client';

import { useState } from 'react';
import Image from 'next/image';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { formatDate, getRatingColor } from '@/lib/utils';
import type { TMDBReview } from '@/lib/types';

interface ReviewsSectionProps {
  reviews: TMDBReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews?.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-5">
        Reviews <span className="text-film-muted font-normal text-base">({reviews.length})</span>
      </h2>
      <div className="space-y-4">
        {reviews.slice(0, 5).map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: TMDBReview }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 300;

  const avatarUrl = review.author_details.avatar_path
    ? review.author_details.avatar_path.startsWith('/https')
      ? review.author_details.avatar_path.substring(1)
      : tmdbImage(review.author_details.avatar_path, IMAGE_SIZES.profile.small)
    : null;

  return (
    <div className="bg-film-card border border-film-border/30 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-film-surface flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={review.author}
              width={40}
              height={40}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-film-accent text-white font-bold text-sm">
              {review.author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white text-sm">{review.author}</h3>
            {review.author_details.rating && (
              <span className={`text-xs font-bold ${getRatingColor(review.author_details.rating)}`}>
                ★ {review.author_details.rating}/10
              </span>
            )}
          </div>
          <p className="text-xs text-film-muted">{formatDate(review.created_at)}</p>
        </div>
      </div>

      <div className={`text-sm text-film-muted leading-relaxed ${!expanded && isLong ? 'line-clamp-5' : ''}`}>
        {review.content}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-film-accent hover:text-film-accent-hover transition-colors font-medium"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

