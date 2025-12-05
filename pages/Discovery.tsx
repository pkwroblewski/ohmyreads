import React, { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, Compass, Tag, TrendingUp, Cpu } from 'lucide-react';
import { searchBooks, getBooksByGenre, getSourceInfo } from '../services/recommendations';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';
import { usePageMeta, PAGE_META } from '../hooks/usePageMeta';

interface DiscoveryProps {
    onBookClick: (book: Book) => void;
}

const QUICK_GENRES = [
  { name: 'Fantasy', icon: '🐉', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { name: 'Romance', icon: '💕', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
  { name: 'Mystery', icon: '🔍', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  { name: 'Sci-Fi', icon: '🚀', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { name: 'Thriller', icon: '😱', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { name: 'Historical', icon: '🏛️', color: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300' },
];

export const Discovery: React.FC<DiscoveryProps> = ({ onBookClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  
  const sourceInfo = getSourceInfo();
  
  // Set page meta for SEO
  usePageMeta(PAGE_META.discovery);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setActiveGenre(null);
    setIsSearching(true);
    const books = await searchBooks(query);
    setResults(books);
    setIsSearching(false);
  };

  const handleGenreClick = async (genre: string) => {
    setActiveGenre(genre);
    setQuery('');
    setIsSearching(true);
    const books = await getBooksByGenre(genre);
    setResults(books);
    setIsSearching(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 min-h-[80vh]">
      <div className="text-center space-y-4 py-10">
        <div className="flex items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-xs font-semibold tracking-wider text-accent uppercase shadow-sm">
             <BookOpen size={12} />
             Millions of Books to Explore
          </div>
          {sourceInfo.isAI && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-700 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm">
              <Cpu size={12} />
              {sourceInfo.badge}
            </div>
          )}
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100">Find Your Next Great Read</h2>
        <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
          Search by title, author, genre, or mood. {sourceInfo.isAI 
            ? 'Powered by AI for smarter, personalized recommendations.' 
            : 'Explore millions of books from the world\'s largest open library.'}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or genre..."
          className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm focus:border-ink dark:focus:border-stone-500 outline-none text-lg transition-all text-ink dark:text-white"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-2 p-2 bg-ink dark:bg-stone-700 text-white rounded-full hover:bg-stone-800 dark:hover:bg-stone-600 disabled:opacity-50 transition-colors"
        >
          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
        </button>
      </form>

      {/* Quick Genre Buttons */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {QUICK_GENRES.map((genre) => (
          <button
            key={genre.name}
            onClick={() => handleGenreClick(genre.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
              activeGenre === genre.name 
                ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-stone-900' 
                : ''
            } ${genre.color}`}
          >
            <span className="mr-1">{genre.icon}</span> {genre.name}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {isSearching && (
          <div className="h-48 flex items-center justify-center text-stone-400">
            <Loader2 className="animate-spin mr-2" /> Searching the library...
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div>
            {activeGenre && (
              <div className="flex items-center gap-2 mb-6">
                <Tag size={16} className="text-accent" />
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Showing {activeGenre} books
                </span>
                <button 
                  onClick={() => { setActiveGenre(null); setResults([]); }}
                  className="text-xs text-accent hover:underline ml-2"
                >
                  Clear
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                {results.map((book) => (
                    <BookCard key={book.id} book={book} onClick={onBookClick} />
                ))}
            </div>
            </div>
        )}

        {!isSearching && results.length === 0 && (
          <div className="text-center text-stone-400 py-12 space-y-4">
            <Compass size={48} className="mx-auto opacity-50" />
            <p className="text-lg">Start exploring the infinite library</p>
            <p className="text-sm">Search for any book or click a genre above to browse</p>
            </div>
        )}
      </div>
    </div>
  );
};