import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { getCuratedList, getCommunityFavorites, getRealTimeTrends, getSourceInfo } from '../services/recommendations';
import { BookCard } from '../components/BookCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { usePageMeta, PAGE_META } from '../hooks/usePageMeta';
import { Loader2, BookOpen, Heart, TrendingUp, Sparkles, LogIn, Cpu, BarChart3 } from 'lucide-react';

interface LandingProps {
  onBookClick: (book: Book) => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onBookClick, onSignIn, onSignUp }) => {
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
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Compact Hero Section with Integrated Features */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-leaf/10 dark:bg-leaf/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center py-8 md:py-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4 leading-tight">
            Your AI-Powered <span className="text-accent">Book Discovery App.</span>
          </h1>
          
          <p className="text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto mb-6">
            Track reading, discover books, and connect with readers worldwide.
          </p>
          
          {/* Integrated Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full text-sm font-medium text-amber-700 dark:text-amber-300">
              <BookOpen size={16} />
              Reading Log
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300">
              <Sparkles size={16} />
              AI Recommendations
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300">
              <BarChart3 size={16} />
              Reading Stats
            </div>
          </div>
        </div>
      </section>

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
            onClick={onSignUp}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg hover:-translate-y-1"
          >
            <Sparkles size={20} />
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

