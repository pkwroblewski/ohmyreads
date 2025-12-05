import React, { useState, useEffect } from 'react';
import { Book, CurrentRead, User, ReadingGoals as ReadingGoalsType } from '../types';
import { BookCard } from '../components/BookCard';
import { ReadingGoals } from '../components/ReadingGoals';
import { getCuratedList } from '../services/recommendations';
import { Plus, CheckCircle2, Sparkles, Search, BookOpen, Library, Loader2, MessageCircle } from 'lucide-react';

interface MyShelfProps {
  user: User;
  onBookClick: (book: Book) => void;
  currentRead: CurrentRead | null;
  onUpdateProgress: (pages: number) => void;
  onFinishBook: () => void;
  onFindBook: () => void;
  libraryBooks: Book[];
  onAddBook: () => void;
  readingGoals: ReadingGoalsType;
  onUpdateGoals: (pagesPerDay: number, booksPerYear: number) => void;
  onAskConcierge?: (query: string) => void;
}

export const MyShelf: React.FC<MyShelfProps> = ({ 
  user,
  onBookClick, 
  currentRead, 
  onUpdateProgress, 
  onFinishBook, 
  onFindBook, 
  libraryBooks, 
  onAddBook,
  readingGoals,
  onUpdateGoals,
  onAskConcierge
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Fetch personalized recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      try {
        const books = await getCuratedList();
        // Show just 2 recommendations for the dashboard
        setRecommendations(books.slice(0, 2));
      } catch (e) {
        console.error('Failed to fetch recommendations:', e);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput);
    if (!isNaN(p)) {
      onUpdateProgress(p);
    }
    setIsEditing(false);
  };

  const percent = currentRead 
    ? Math.round((currentRead.progress / currentRead.totalPages) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <Library size={28} className="text-accent" />
          <h2 className="text-3xl font-serif font-bold text-ink dark:text-stone-100">My Shelf</h2>
        </div>
        <p className="text-stone-500 dark:text-stone-400">Welcome back, {user.name}. Your personal reading sanctuary.</p>
      </header>

      {/* Reading Goals Panel */}
      <ReadingGoals goals={readingGoals} onUpdateGoals={onUpdateGoals} />

      {/* Currently Reading */}
      {currentRead ? (
        <section aria-label="Currently Reading" className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden transition-colors">
          {/* Progress Background Effect */}
          <div className="absolute bottom-0 left-0 h-1 bg-amber-100 dark:bg-amber-900/30 w-full z-0">
            <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${percent}%` }}></div>
          </div>

          <div className="w-full md:w-1/3 shrink-0 z-10 flex justify-center md:justify-start">
            <div className="aspect-[2/3] w-48 md:w-full max-w-[200px] bg-stone-200 dark:bg-stone-800 rounded-lg overflow-hidden relative shadow-lg rotate-1 transition-transform duration-300">
              <img src={currentRead.coverUrl} className="w-full h-full object-cover" alt={`Cover of ${currentRead.title}`} loading="eager" />
            </div>
          </div>
          <div className="flex-1 space-y-4 z-10 w-full text-center md:text-left">
            <span className="text-xs font-bold tracking-widest text-accent uppercase">Currently Reading</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-ink dark:text-stone-100">{currentRead.title}</h3>
            <p className="text-lg text-stone-600 dark:text-stone-400 font-serif italic">by {currentRead.author}</p>
            
            <div className="space-y-2 py-2">
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full transition-all duration-700" style={{ width: `${percent}%` }}></div>
              </div>
              <p className="text-sm text-stone-400 font-medium">
                Page {currentRead.progress} of {currentRead.totalPages} ({percent}%)
              </p>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {isEditing ? (
                <form onSubmit={handleProgressSubmit} className="flex items-center gap-2">
                  <input 
                    type="number" 
                    autoFocus
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder={currentRead.progress.toString()}
                    className="w-24 p-2 border border-stone-300 dark:border-stone-600 rounded-lg text-center font-bold outline-none focus:border-accent bg-white dark:bg-stone-800 text-ink dark:text-stone-100"
                  />
                  <button type="submit" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><CheckCircle2 size={20}/></button>
                  <button onClick={() => setIsEditing(false)} type="button" className="p-2 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600">Cancel</button>
                </form>
              ) : (
                <button 
                  onClick={() => { setIsEditing(true); setPageInput(currentRead.progress.toString()); }}
                  className="px-6 py-2 bg-ink dark:bg-stone-700 text-white rounded-full font-medium hover:bg-stone-800 dark:hover:bg-stone-600 transition-colors shadow-lg shadow-stone-200 dark:shadow-none"
                >
                  Log Reading
                </button>
              )}
              
              {percent >= 100 && (
                <button 
                  onClick={onFinishBook}
                  className="px-6 py-2 border-2 border-accent text-accent rounded-full font-bold hover:bg-accent hover:text-white transition-colors"
                >
                  Finish Book
                </button>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section aria-label="Start a new book" className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-md border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group transition-all hover:shadow-lg">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl transition-all group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-stone-100 dark:bg-stone-800/50 rounded-full blur-3xl"></div>

          {/* Visual */}
          <div className="relative z-10 shrink-0 transform md:pl-8">
            <div className="w-36 h-52 md:w-44 md:h-60 bg-paper dark:bg-stone-800 rounded-r-lg rounded-l-sm shadow-2xl border-l-4 border-l-stone-300 dark:border-l-stone-600 border-y border-r border-stone-200 dark:border-stone-700 flex flex-col relative rotate-3 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105 overflow-hidden">
              {/* Cover Pattern */}
              <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(circle_at_1px_1px,#1F3B34_1px,transparent_0)] bg-[size:10px_10px]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-stone-200/50 dark:to-stone-900/80 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-accent shadow-sm">
                  <Sparkles size={20} strokeWidth={2.5} />
                </div>
                <h4 className="font-serif font-bold text-ink dark:text-stone-100 text-xl leading-none mb-2">Your<br/>Next<br/>Read</h4>
                <div className="w-8 h-1 bg-accent rounded-full mt-2"></div>
              </div>
              
              {/* Spine Shadow Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left relative z-10 space-y-5">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-ink dark:text-stone-100 mb-2">
                Ready for a new adventure?
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
                Your shelf is waiting for its next book. Browse our collection or add one manually.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={onFindBook}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-ink dark:bg-stone-700 text-white font-bold rounded-full hover:bg-stone-800 dark:hover:bg-stone-600 transition-all shadow-lg shadow-stone-200 dark:shadow-none hover:-translate-y-1"
              >
                <Search size={18} /> Browse Discovery
              </button>
              <button 
                onClick={onAddBook}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-stone-800 text-ink dark:text-stone-200 font-bold rounded-full border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all hover:-translate-y-1"
              >
                <Plus size={18} /> Add Manually
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Personalized Recommendations */}
      <section aria-labelledby="recommendations-heading" className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 id="recommendations-heading" className="text-lg font-bold text-ink dark:text-stone-100 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-500" />
              Recommended For You
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Based on popular reads</p>
          </div>
          {onAskConcierge && (
            <button 
              onClick={() => onAskConcierge('Recommend books for me')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-800 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
            >
              <MessageCircle size={14} /> Ask Concierge
            </button>
          )}
        </div>
        
        {loadingRecs ? (
          <div className="h-32 flex items-center justify-center text-stone-400">
            <Loader2 className="animate-spin mr-2" size={20} /> Finding recommendations...
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map(book => (
              <button 
                key={book.id}
                onClick={() => onBookClick(book)}
                className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all text-left group flex gap-4"
              >
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-ink dark:text-stone-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{book.author}</p>
                  {book.rating && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">★ {book.rating.toFixed(1)}</p>
                  )}
                  {book.moods && book.moods.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {book.moods.slice(0, 2).map(mood => (
                        <span key={mood} className="text-[10px] px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                          {mood}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-stone-400">
            <p>No recommendations available right now</p>
          </div>
        )}
      </section>

      {/* My Collection */}
      <section aria-labelledby="my-collection-heading">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 id="my-collection-heading" className="text-xl font-bold text-ink dark:text-stone-100 flex items-center gap-2">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              My Collection
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 ml-4">
              {libraryBooks.length} {libraryBooks.length === 1 ? 'book' : 'books'} in your library
            </p>
          </div>
          <button onClick={onAddBook} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            <Plus size={16} /> Add Book
          </button>
        </div>
        
        {libraryBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {libraryBooks.map(book => (
              <article key={book.id}>
                <BookCard book={book} onClick={onBookClick} />
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-12 text-center border border-dashed border-stone-200 dark:border-stone-700">
            <BookOpen size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
            <h4 className="font-bold text-ink dark:text-stone-100 mb-2">Your shelf is empty</h4>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">Start building your library by adding your first book</p>
            <button 
              onClick={onAddBook}
              className="inline-flex items-center gap-2 px-6 py-2 bg-ink dark:bg-stone-700 text-white rounded-full font-medium hover:bg-stone-800 dark:hover:bg-stone-600 transition-colors"
            >
              <Plus size={16} /> Add Your First Book
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

