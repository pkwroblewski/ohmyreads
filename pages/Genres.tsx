import React, { useState } from 'react';
import { Book, Genre } from '../types';
import { BookCard } from '../components/BookCard';
import { getBooksByGenre } from '../services/openLibraryService';
import { 
  Sparkles, Heart, Skull, Rocket, Search, Crown, 
  Ghost, Flame, BookOpen, Baby, Laugh, Scale,
  Loader2, ArrowRight
} from 'lucide-react';

interface GenresProps {
  onBookClick: (book: Book) => void;
}

const GENRES: Genre[] = [
  { id: '1', name: 'Fantasy', slug: 'fantasy', description: 'Magical worlds and epic adventures', icon: 'sparkles', color: 'from-purple-500 to-indigo-600', bookCount: 0 },
  { id: '2', name: 'Romance', slug: 'romance', description: 'Love stories that touch the heart', icon: 'heart', color: 'from-rose-500 to-pink-600', bookCount: 0 },
  { id: '3', name: 'Mystery', slug: 'mystery', description: 'Puzzles, detectives, and suspense', icon: 'search', color: 'from-slate-600 to-slate-800', bookCount: 0 },
  { id: '4', name: 'Science Fiction', slug: 'science_fiction', description: 'Future worlds and technology', icon: 'rocket', color: 'from-cyan-500 to-blue-600', bookCount: 0 },
  { id: '5', name: 'Horror', slug: 'horror', description: 'Tales that send shivers down your spine', icon: 'skull', color: 'from-gray-800 to-black', bookCount: 0 },
  { id: '6', name: 'Historical Fiction', slug: 'historical_fiction', description: 'Stories set in fascinating eras', icon: 'crown', color: 'from-amber-600 to-yellow-700', bookCount: 0 },
  { id: '7', name: 'Thriller', slug: 'thriller', description: 'Heart-pounding suspense', icon: 'flame', color: 'from-red-600 to-orange-600', bookCount: 0 },
  { id: '8', name: 'Literary Fiction', slug: 'literary_fiction', description: 'Character-driven narratives', icon: 'book', color: 'from-emerald-600 to-teal-700', bookCount: 0 },
  { id: '9', name: 'Young Adult', slug: 'young_adult', description: 'Coming-of-age adventures', icon: 'baby', color: 'from-violet-500 to-purple-600', bookCount: 0 },
  { id: '10', name: 'Humor', slug: 'humor', description: 'Books that make you laugh', icon: 'laugh', color: 'from-yellow-400 to-orange-500', bookCount: 0 },
  { id: '11', name: 'Paranormal', slug: 'paranormal', description: 'Supernatural and otherworldly', icon: 'ghost', color: 'from-indigo-600 to-purple-800', bookCount: 0 },
  { id: '12', name: 'Non-Fiction', slug: 'nonfiction', description: 'Real stories and knowledge', icon: 'scale', color: 'from-stone-500 to-stone-700', bookCount: 0 },
];

const getIcon = (iconName: string, size: number = 24) => {
  const icons: Record<string, React.ReactNode> = {
    sparkles: <Sparkles size={size} />,
    heart: <Heart size={size} />,
    search: <Search size={size} />,
    rocket: <Rocket size={size} />,
    skull: <Skull size={size} />,
    crown: <Crown size={size} />,
    flame: <Flame size={size} />,
    book: <BookOpen size={size} />,
    baby: <Baby size={size} />,
    laugh: <Laugh size={size} />,
    ghost: <Ghost size={size} />,
    scale: <Scale size={size} />,
  };
  return icons[iconName] || <BookOpen size={size} />;
};

export const Genres: React.FC<GenresProps> = ({ onBookClick }) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenreClick = async (genre: Genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    try {
      const genreBooks = await getBooksByGenre(genre.slug);
      setBooks(genreBooks);
    } catch (error) {
      console.error('Error fetching genre books:', error);
      setBooks([]);
    }
    setLoading(false);
  };

  const handleBackToGenres = () => {
    setSelectedGenre(null);
    setBooks([]);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          Explore by Genre
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Discover your next favorite book by browsing our curated genre collections. 
          Each genre is a doorway to new worlds and unforgettable stories.
        </p>
      </header>

      {selectedGenre ? (
        /* Genre Detail View */
        <div className="space-y-8">
          {/* Genre Header */}
          <div className={`bg-gradient-to-r ${selectedGenre.color} rounded-2xl p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              {getIcon(selectedGenre.icon, 256)}
            </div>
            <button
              onClick={handleBackToGenres}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
            >
              ← Back to all genres
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                {getIcon(selectedGenre.icon, 32)}
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold">{selectedGenre.name}</h2>
                <p className="text-white/80">{selectedGenre.description}</p>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-stone-400">
              <Loader2 className="animate-spin mr-2" /> Loading {selectedGenre.name} books...
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map(book => (
                <article key={book.id}>
                  <BookCard book={book} onClick={onBookClick} />
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              No books found for this genre. Try another one!
            </div>
          )}
        </div>
      ) : (
        /* Genre Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre)}
              className={`group relative bg-gradient-to-br ${genre.color} rounded-2xl p-6 text-white text-left overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              {/* Background Icon */}
              <div className="absolute -bottom-4 -right-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                {getIcon(genre.icon, 120)}
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  {getIcon(genre.icon, 24)}
                </div>
                <h3 className="text-xl font-bold mb-2">{genre.name}</h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">{genre.description}</p>
                <div className="flex items-center gap-2 text-white/60 text-sm group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* SEO Content Section */}
      {!selectedGenre && (
        <section className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
            Find Your Perfect Read
          </h2>
          <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
            <p>
              Whether you're looking for an epic fantasy adventure, a heart-warming romance, 
              or a mind-bending science fiction thriller, our genre categories help you discover 
              books that match your reading mood.
            </p>
            <p>
              Each genre page features curated selections, trending titles, and hidden gems 
              recommended by our community of passionate readers. Start exploring and find 
              your next unforgettable story today.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

