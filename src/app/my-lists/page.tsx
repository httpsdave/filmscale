'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbImage, IMAGE_SIZES } from '@/lib/constants';
import { extractYear, cn } from '@/lib/utils';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { useLists } from '@/context/ListsContext';
import type { MovieListItem, ListType } from '@/lib/types';

export default function MyListsPage() {
  const [activeTab, setActiveTab] = useState<ListType>('favorites');
  const {
    favorites, watchlist, watched,
    removeFavorite, removeFromWatchlist, removeWatched,
    isLoaded,
  } = useLists();

  const tabs: { key: ListType; label: string; icon: string; count: number }[] = [
    { key: 'favorites', label: 'Favorites', icon: '❤️', count: favorites.length },
    { key: 'watchlist', label: 'Watchlist', icon: '🔖', count: watchlist.length },
    { key: 'watched', label: 'Watched', icon: '👁️', count: watched.length },
  ];

  const activeItems = activeTab === 'favorites' ? favorites
    : activeTab === 'watchlist' ? watchlist : watched;

  const removeItem = (id: number) => {
    if (activeTab === 'favorites') removeFavorite(id);
    else if (activeTab === 'watchlist') removeFromWatchlist(id);
    else removeWatched(id);
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white mb-8">My Lists</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
                activeTab === tab.key
                  ? 'bg-film-accent text-white shadow-lg shadow-film-accent/20'
                  : 'bg-film-card border border-film-border text-film-muted hover:text-white hover:border-film-accent'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span className={cn(
                'ml-1 px-2 py-0.5 rounded-full text-xs',
                activeTab === tab.key ? 'bg-white/20' : 'bg-film-surface'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {!isLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : activeItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activeItems.map(item => (
              <ListCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">
              {activeTab === 'favorites' ? '❤️' : activeTab === 'watchlist' ? '🔖' : '👁️'}
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Your {tabs.find(t => t.key === activeTab)?.label} is empty
            </h2>
            <p className="text-film-muted mb-6">
              Start exploring movies and add them to your list!
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-film-accent hover:bg-film-accent-hover text-white rounded-lg font-semibold transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ListCard({ item, onRemove }: { item: MovieListItem; onRemove: () => void }) {
  return (
    <div className="group relative">
      <Link href={`/movie/${item.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-film-card">
          <Image
            src={tmdbImage(item.poster_path, IMAGE_SIZES.poster.medium)}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.vote_average > 0 && (
            <div className="absolute top-2 left-2">
              <RatingBadge rating={item.vote_average} />
            </div>
          )}
        </div>
        <h3 className="mt-2 text-sm font-medium text-film-text group-hover:text-film-accent transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-film-muted">{extractYear(item.release_date)}</p>
      </Link>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-film-muted hover:text-red-400 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all"
        title="Remove from list"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
