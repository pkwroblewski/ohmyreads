import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { getCuratedList, getCommunityFavorites, getRealTimeTrends, getSourceInfo } from '../services/recommendations';
import { BookCard } from '../components/BookCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { usePageMeta, PAGE_META } from '../hooks/usePageMeta';
import { Loader2, BookOpen, Heart, TrendingUp, Sparkles, LogIn, Cpu } from 'lucide-react';

interface LandingProps {
  onBookClick: (book: Book) => void;
  onSignIn: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onBookClick, onSignIn }) => {
  const [trending, setTrending] = useState<Book[]>([]);
  const [communityPicks, setCommunityPicks] = useState<Book[]>([]);
  const [zeitgeist, setZeitgeist] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sourceInfo = getSourceInfo();
  
  // Set page meta for SEO
  usePageMeta(PAGE_META.landing);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const [curated, community, realTime] = await Promise.all([
        getCuratedList(),
        getCommunityFavorites(),
        getRealTimeTrends()
      ]);
      setTrending(curated);
      setCommunityPicks(community);
      setZeitgeist(realTime);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-leaf/10 dark:bg-leaf/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center py-12 md:py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-sm font-medium text-accent mb-6 shadow-sm">
            <Sparkles size={16} />
            Your Personal Reading Companion
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink dark:text-stone-100 mb-6 leading-tight">
            Your AI-Powered<br />
            <span className="text-accent">Book Discovery App.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your reading progress, set goals, and discover your next favorite book with 
            OhMyReads — the smart book tracker and reading companion for book lovers everywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignIn}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink dark:bg-accent text-white font-bold rounded-full hover:bg-stone-800 dark:hover:bg-amber-600 transition-all shadow-lg hover:-translate-y-1"
            >
              <BookOpen size={20} />
              Start Your Reading Journey
            </button>
            <button
              onClick={onSignIn}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-stone-800 text-ink dark:text-stone-200 font-bold rounded-full border-2 border-stone-200 dark:border-stone-700 hover:border-accent hover:text-accent transition-all hover:-translate-y-1"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Strip - SEO-optimized feature descriptions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Key Features">
        <article className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-100 dark:border-stone-800 text-center">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-ink dark:text-stone-100 mb-2">Personal Reading Log</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">Track your reading progress, set daily page goals, and build streaks to stay motivated</p>
        </article>
        <article className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-100 dark:border-stone-800 text-center">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart size={24} />
          </div>
          <h3 className="font-bold text-ink dark:text-stone-100 mb-2">AI Book Recommendations</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">Discover books tailored to your taste with our intelligent book discovery engine</p>
        </article>
        <article className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-100 dark:border-stone-800 text-center">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-ink dark:text-stone-100 mb-2">Reading Statistics</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">Visualize your reading habits with beautiful charts and yearly progress tracking</p>
        </article>
      </section>

      {/* Ad Banner */}
      <AdPlaceholder slot="banner" className="my-4" />

      {/* Curated Books */}
      <section aria-labelledby="curated-heading">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 id="curated-heading" className="text-2xl font-serif font-bold text-ink dark:text-stone-100 flex items-center gap-2">
              <span className="w-2 h-8 bg-accent rounded-full"></span>
              Curated For You
              {sourceInfo.isAI && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-700 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300">
                  <Cpu size={10} /> AI
                </span>
              )}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 ml-4">
              {sourceInfo.isAI ? 'AI-curated selection based on trending reads' : 'Award-winning books handpicked by our team'}
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="h-48 flex items-center justify-center text-stone-400">
            <Loader2 className="animate-spin mr-2" /> Curating shelves...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map(book => (
              <article key={book.id}>
                <BookCard book={book} onClick={onBookClick} />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Community Favorites */}
      <section aria-labelledby="community-heading">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 id="community-heading" className="text-2xl font-serif font-bold text-ink dark:text-stone-100 flex items-center gap-2">
              <Heart size={24} className="text-rose-500 fill-rose-500" />
              Community Favorites
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 ml-8">Most loved by the OhMyReads community</p>
          </div>
        </div>
        
        {loading ? (
          <div className="h-48 flex items-center justify-center text-stone-400">
            <Loader2 className="animate-spin mr-2" /> Checking community pulse...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityPicks.map(book => (
              <article key={book.id}>
                <BookCard book={book} onClick={onBookClick} />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Trending Now */}
      <section aria-labelledby="trending-heading">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 id="trending-heading" className="text-2xl font-serif font-bold text-ink dark:text-stone-100 flex items-center gap-2">
              <TrendingUp size={24} className="text-indigo-500" />
              Trending Now
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 ml-8">What readers are loving right now</p>
          </div>
        </div>
        
        {loading ? (
          <div className="h-48 flex items-center justify-center text-stone-400">
            <Loader2 className="animate-spin mr-2" /> Scanning the web...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {zeitgeist.map(book => (
              <article key={book.id}>
                <BookCard book={book} onClick={onBookClick} />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-ink dark:bg-stone-800 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-stone-300 mb-8 max-w-xl mx-auto">
            Create your free account and begin tracking your books, discovering new reads, and joining our community of book lovers.
          </p>
          <button
            onClick={onSignIn}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg hover:-translate-y-1"
          >
            <Sparkles size={20} />
            Add Your First Book
          </button>
        </div>
      </section>
    </div>
  );
};

