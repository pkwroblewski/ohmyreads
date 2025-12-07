import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { getCuratedList, getCommunityFavorites, getRealTimeTrends, getSourceInfo } from '../services/recommendations';
import { FeaturedBookHero } from '../components/FeaturedBookHero';
import { TabbedBookSection, createDefaultTabs } from '../components/TabbedBookSection';
import { ReadingChallengeWidget } from '../components/ReadingChallengeWidget';
import { CommunityReviewsFeed } from '../components/CommunityReviewsFeed';
import { usePageMeta, PAGE_META } from '../hooks/usePageMeta';
import { Loader2, Sparkles } from 'lucide-react';

interface LandingProps {
  onBookClick: (book: Book) => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onBookClick, onSignIn, onSignUp }) => {
  const [curated, setCurated] = useState<Book[]>([]);
  const [communityPicks, setCommunityPicks] = useState<Book[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sourceInfo = getSourceInfo();
  
  // Set page meta for SEO
  usePageMeta(PAGE_META.landing);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const [curatedData, communityData, trendingData] = await Promise.all([
        getCuratedList(),
        getCommunityFavorites(),
        getRealTimeTrends()
      ]);
      setCurated(curatedData);
      setCommunityPicks(communityData);
      setTrending(trendingData);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  // Get featured book (first from curated or trending)
  const featuredBook = curated[0] || trending[0];
  
  // Books for tabbed section (exclude featured from curated)
  const tabbedCurated = curated.slice(1);
  
  // Create tabs configuration
  const tabs = createDefaultTabs(tabbedCurated, communityPicks, trending, sourceInfo.isAI);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Featured Book Hero */}
      {loading ? (
        <div className="h-48 md:h-56 flex items-center justify-center rounded-2xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900/30">
          <Loader2 className="animate-spin mr-2 text-stone-400 dark:text-zinc-500" size={24} />
          <span className="text-stone-500 dark:text-zinc-400">Finding the perfect book...</span>
        </div>
      ) : featuredBook ? (
        <FeaturedBookHero 
          book={featuredBook}
          onViewDetails={onBookClick}
        />
      ) : null}

      {/* Tabbed Book Sections */}
      <TabbedBookSection 
        tabs={tabs}
        loading={loading}
        onBookClick={onBookClick}
      />

      {/* Two-Column Layout: Reviews + Challenge Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Reviews Feed - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CommunityReviewsFeed />
        </div>
        
        {/* Sidebar - Challenge Widget */}
        <div className="space-y-6">
          <ReadingChallengeWidget 
            booksRead={12}
            booksGoal={24}
            currentStreak={5}
            onSetGoal={onSignUp}
          />
          
          {/* Quick Stats Card */}
          <div className="p-5 bg-white dark:bg-zinc-900/30 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <h4 className="text-sm font-semibold text-ink dark:text-white mb-4">Join Our Community</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-ink dark:text-white">50k+</div>
                <div className="text-xs text-stone-500 dark:text-zinc-500">Active Readers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink dark:text-white">120k</div>
                <div className="text-xs text-stone-500 dark:text-zinc-500">Books Tracked</div>
              </div>
            </div>
            <button
              onClick={onSignUp}
              className="w-full mt-4 py-2.5 text-sm font-medium text-white bg-ink dark:bg-indigo-600 hover:bg-stone-800 dark:hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Join Free
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-ink via-stone-800 to-ink dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/20 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/20 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-stone-300 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
            Create your free account and begin tracking your books, discovering new reads, and joining our community of book lovers.
          </p>
          <button
            onClick={onSignUp}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-lg hover:-translate-y-1 hover:shadow-xl"
          >
            <Sparkles size={20} />
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
};
