import Link from 'next/link';
import { SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR, SITE_AUTHOR_URL, FOOTER_GENRES, FOOTER_QUICK_LINKS, GENRE_LIST } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-film-darker border-t border-film-border/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-film-accent rounded-lg flex items-center justify-center font-bold text-white text-sm">
                FS
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Film</span>
                <span className="text-film-accent">Scale</span>
              </span>
            </Link>
            <p className="text-film-muted text-sm leading-relaxed max-w-xs">
              {SITE_DESCRIPTION}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-film-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {FOOTER_QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-film-muted hover:text-film-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-film-text mb-4">Genres</h4>
            <ul className="space-y-2">
              {FOOTER_GENRES.map(genre => {
                const genreObj = GENRE_LIST.find(g => g.name === genre);
                return (
                  <li key={genre}>
                    <Link
                      href={`/browse?genre=${genreObj?.id || ''}`}
                      className="text-sm text-film-muted hover:text-film-accent transition-colors"
                    >
                      {genre}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Powered By */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-film-text mb-4">Powered By</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-film-muted hover:text-film-accent transition-colors"
                >
                  The Movie Database (TMDB)
                </a>
              </li>
              <li>
                <a
                  href="https://www.omdbapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-film-muted hover:text-film-accent transition-colors"
                >
                  OMDb API
                </a>
              </li>
              <li>
                <a
                  href="https://www.rottentomatoes.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-film-muted hover:text-film-accent transition-colors"
                >
                  Rotten Tomatoes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-film-border/30 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-film-muted mb-4">Built By</h4>
            <a
              href={SITE_AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-film-accent transition-colors mb-2">
                <img src="https://github.com/httpsdave.png" alt="httpsdave" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1.5 text-film-text group-hover:text-film-accent transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="font-bold text-sm">httpsdave</span>
              </div>
            </a>
          </div>
          
          <p className="text-xs text-film-muted text-center max-w-lg">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
