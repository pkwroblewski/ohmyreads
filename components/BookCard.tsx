import React from 'react';
import { Book } from '../types';
import { Star, ImageOff, Book as BookIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
  compact?: boolean;
  onClick?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false, onClick }) => {
  const hasCover = Boolean(book.coverUrl && book.coverUrl.trim() !== '');

  return (
    <div 
        onClick={() => onClick?.(book)}
        className="group relative bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-soft dark:border-stone-800 flex flex-col h-full cursor-pointer"
    >
      <div className={`relative overflow-hidden bg-soft dark:bg-stone-800 ${compact ? 'h-48' : 'h-64'}`}>
        {hasCover ? (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-soft to-sand dark:from-stone-800 dark:to-stone-900 group-hover:scale-105 transition-transform duration-500">
                <div className="w-12 h-16 border-2 border-stone-300 dark:border-stone-600 rounded-sm flex items-center justify-center mb-3 bg-white/50 dark:bg-black/20">
                    <BookIcon className="text-stone-400 dark:text-stone-500" size={20} />
                </div>
                <h4 className="font-serif font-bold text-ink dark:text-stone-200 text-sm leading-tight line-clamp-2">{book.title}</h4>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">{book.author}</p>
            </div>
        )}

        <div className="absolute top-2 right-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-ink dark:text-stone-100 z-10">
            <Star size={12} className="text-accent fill-accent" />
            {book.rating ? book.rating.toFixed(1) : 'N/A'}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1 bg-white dark:bg-stone-900">
        <h3 className="font-serif font-bold text-lg text-ink dark:text-stone-100 leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mb-2">{book.author}</p>
        
        {book.moods && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {book.moods.slice(0, 3).map((mood, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider bg-soft dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded-sm">
                {mood}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};