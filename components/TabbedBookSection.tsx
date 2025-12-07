import React, { useState } from 'react';
import { Book } from '../types';
import { BookCard } from './BookCard';
import { Loader2, Cpu, Heart, TrendingUp, Sparkles } from 'lucide-react';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  books: Book[];
  description: string;
  isAI?: boolean;
}

interface TabbedBookSectionProps {
  tabs: TabConfig[];
  loading?: boolean;
  onBookClick: (book: Book) => void;
  onAddToLibrary?: (book: Book) => void;
}

export const TabbedBookSection: React.FC<TabbedBookSectionProps> = ({
  tabs,
  loading = false,
  onBookClick,
  onAddToLibrary
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <section className="space-y-6">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-stone-200 dark:border-zinc-800 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all relative
              ${activeTab === tab.id 
                ? 'text-ink dark:text-white' 
                : 'text-stone-500 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300'
              }`}
          >
            <span className={`transition-colors ${activeTab === tab.id ? 'text-accent dark:text-indigo-400' : ''}`}>
              {tab.icon}
            </span>
            {tab.label}
            {tab.isAI && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-700 rounded text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                <Cpu size={8} /> AI
              </span>
            )}
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent dark:bg-indigo-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Description */}
      {currentTab && (
        <p className="text-sm text-stone-500 dark:text-zinc-400">
          {currentTab.description}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-stone-400 dark:text-zinc-500">
          <Loader2 className="animate-spin mr-2" size={20} /> 
          Loading books...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
          {currentTab?.books.map((book) => (
            <article key={book.id}>
              <BookCard 
                book={book} 
                onClick={onBookClick}
                onAddToLibrary={onAddToLibrary}
                compact
              />
            </article>
          ))}
          {currentTab?.books.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-400 dark:text-zinc-500">
              No books found in this category.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// Pre-configured tab configurations for common use cases
export const createDefaultTabs = (
  curated: Book[],
  community: Book[],
  trending: Book[],
  isAI: boolean = false
): TabConfig[] => [
  {
    id: 'curated',
    label: 'Curated For You',
    icon: <Sparkles size={16} />,
    books: curated,
    description: isAI ? 'AI-curated selection based on trending reads' : 'Award-winning books handpicked by our team',
    isAI
  },
  {
    id: 'community',
    label: 'Community Favorites',
    icon: <Heart size={16} />,
    books: community,
    description: 'Most loved by the OhMyReads community'
  },
  {
    id: 'trending',
    label: 'Trending Now',
    icon: <TrendingUp size={16} />,
    books: trending,
    description: 'What readers are loving right now'
  }
];

