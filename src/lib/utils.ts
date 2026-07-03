/**
 * Format runtime in minutes to "Xh Ym" format
 */
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/**
 * Format a number as USD currency (e.g. $60.0M)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (!amount || amount === 0) return 'N/A';
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Format currency with full number display
 */
export function formatCurrencyFull(amount: string | null | undefined): string {
  if (!amount || amount === 'N/A') return 'N/A';
  return amount;
}

/**
 * Extract year from TMDB date string
 */
export function extractYear(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  return dateStr.substring(0, 4);
}

/**
 * Format a full date string
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get rating color class based on score (0-10 scale)
 */
export function getRatingColor(rating: number): string {
  if (rating >= 7) return 'text-green-400';
  if (rating >= 5) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Get rating background color class
 */
export function getRatingBgColor(rating: number): string {
  if (rating >= 7) return 'bg-green-500/20 text-green-400';
  if (rating >= 5) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
}

/**
 * Get Metacritic color based on score (0-100)
 */
export function getMetacriticColor(score: number): string {
  if (score >= 61) return 'bg-green-600 text-white';
  if (score >= 40) return 'bg-yellow-500 text-black';
  return 'bg-red-600 text-white';
}

/**
 * Parse Rotten Tomatoes percentage string to number
 */
export function parseRTScore(value: string): number | null {
  const match = value.match(/(\d+)%/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}

/**
 * Get language name from ISO code
 */
export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', ja: 'Japanese', ko: 'Korean',
    zh: 'Chinese', hi: 'Hindi', ar: 'Arabic', ru: 'Russian',
    nl: 'Dutch', sv: 'Swedish', da: 'Danish', fi: 'Finnish',
    no: 'Norwegian', pl: 'Polish', tr: 'Turkish', th: 'Thai',
    id: 'Indonesian', tl: 'Tagalog', vi: 'Vietnamese',
  };
  return languages[code] || code.toUpperCase();
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * cn - merge class names (simple version)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
