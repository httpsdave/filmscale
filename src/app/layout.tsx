import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ListsProvider } from '@/context/ListsContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'FilmScale — Discover, Rate & Track Movies',
    template: '%s | FilmScale',
  },
  description:
    'Your ultimate guide to the world of cinema. Discover movies, read reviews, watch trailers, and build your personal watchlist.',
  keywords: ['movies', 'films', 'cinema', 'reviews', 'trailers', 'watchlist', 'TMDB', 'ratings'],
  authors: [{ name: 'httpsdave', url: 'https://github.com/httpsdave' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-screen flex flex-col bg-film-dark text-film-text">
        <NextTopLoader
          color="#e50914"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #e50914,0 0 5px #e50914"
        />
        
        {/* Background Collage for plain pages */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <img src="/collage.jpg" alt="" className="w-full h-full object-cover opacity-[0.03]" />
          <div className="absolute inset-0 bg-gradient-to-b from-film-dark/80 via-film-dark/50 to-film-dark" />
        </div>

        <ListsProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </ListsProvider>
      </body>
    </html>
  );
}
