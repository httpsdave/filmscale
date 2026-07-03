import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500); // TMDB limits page to 500

  if (maxPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (maxPages <= 7) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(maxPages - 1);
        pages.push(maxPages);
      } else if (currentPage >= maxPages - 3) {
        pages.push(1);
        pages.push(2);
        pages.push('...');
        for (let i = maxPages - 4; i <= maxPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(2);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(maxPages - 1);
        pages.push(maxPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 mb-4 flex-wrap">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-film-border text-film-muted hover:text-white hover:border-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="First page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-film-border text-film-muted hover:text-white hover:border-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5 mx-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="w-8 text-center text-film-muted text-sm sm:text-base">
                ...
              </span>
            );
          }
          
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition-colors cursor-pointer",
                isCurrent 
                  ? "bg-film-accent text-white border border-film-accent shadow-lg shadow-film-accent/20" 
                  : "border border-film-border text-film-muted hover:text-white hover:border-white"
              )}
              aria-label={`Page ${page}`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-film-border text-film-muted hover:text-white hover:border-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(maxPages)}
        disabled={currentPage === maxPages}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-film-border text-film-muted hover:text-white hover:border-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Last page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
