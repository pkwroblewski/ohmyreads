import React, { useState } from 'react';
import { Book } from '../types';
import { Star, BookOpen, Eye, Award } from 'lucide-react';

interface FeaturedBookHeroProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  onStartReading?: (book: Book) => void;
}

export const FeaturedBookHero: React.FC<FeaturedBookHeroProps> = ({ 
  book, 
  onViewDetails,
  onStartReading 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const hasCover = Boolean(book.coverUrl && book.coverUrl.trim() !== '' && !imageError);
  
  // Extract year from publishedDate if available
  const year = book.publishedDate ? new Date(book.publishedDate).getFullYear() : null;
  
  // Get primary genre/mood
  const primaryGenre = book.moods?.[0] || 'Fiction';

  // Placeholder cover component
  const PlaceholderCover = () => (
    <div className="w-28 md:w-36 aspect-[2/3] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-800 dark:to-zinc-900 rounded-lg shadow-2xl flex items-center justify-center border border-stone-200 dark:border-zinc-700">
      <BookOpen className="text-amber-600 dark:text-zinc-500" size={32} />
    </div>
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group">
      {/* Blurred Background Image */}
      <div className="absolute inset-0">
        {hasCover && (
          <img 
            src={book.coverUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-20 dark:opacity-15 blur-2xl scale-110"
            aria-hidden="true"
            onError={() => setImageError(true)}
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/95 to-paper/80 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-8 items-start md:items-center">
        {/* Book Cover */}
        <div className="shrink-0 relative cursor-pointer group/cover" onClick={() => onViewDetails(book)}>
          {hasCover ? (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              className="w-28 md:w-36 aspect-[2/3] object-cover rounded-lg shadow-2xl shadow-black/20 dark:shadow-black/50 border border-stone-200/50 dark:border-white/10 group-hover/cover:-translate-y-1 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <PlaceholderCover />
          )}
        </div>
        
        {/* Book Info */}
        <div className="flex-1 space-y-3 md:space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-300 dark:border-indigo-500/30 bg-amber-50 dark:bg-indigo-500/10 text-amber-700 dark:text-indigo-300 text-[10px] uppercase font-semibold tracking-wider">
            <Award size={12} />
            Editor's Pick
          </div>
          
          {/* Title & Author */}
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink dark:text-white tracking-tight mb-1 leading-tight">
              {book.title}
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 text-sm md:text-base font-medium">
              {book.author}
              {primaryGenre && <span className="text-stone-400 dark:text-zinc-500"> • {primaryGenre}</span>}
              {year && <span className="text-stone-400 dark:text-zinc-500"> • {year}</span>}
            </p>
          </div>
          
          {/* Description */}
          {book.description && (
            <p className="text-stone-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xl line-clamp-2 md:line-clamp-3">
              {book.description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            {onStartReading && (
              <button 
                onClick={() => onStartReading(book)}
                className="flex items-center gap-2 px-5 py-2.5 bg-ink dark:bg-white text-white dark:text-zinc-950 rounded-lg text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
              >
                <BookOpen size={16} />
                Start Reading
              </button>
            )}
            <button 
              onClick={() => onViewDetails(book)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-800 text-ink dark:text-white border border-stone-200 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:border-stone-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <Eye size={16} />
              View Details
            </button>
          </div>
        </div>
        
        {/* Stats Panel - Hidden on small screens */}
        <div className="hidden lg:flex flex-col gap-3 p-4 bg-white/80 dark:bg-zinc-950/50 backdrop-blur-md rounded-xl border border-stone-200 dark:border-zinc-800/50 min-w-[160px]">
          {/* Rating */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star size={16} className="text-amber-500 dark:text-yellow-500 fill-current" />
              <span className="text-xl font-bold text-ink dark:text-white">
                {book.rating ? book.rating.toFixed(1) : '4.5'}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-500 uppercase tracking-wide">Community Rating</span>
          </div>
          
          <div className="h-px bg-stone-200 dark:bg-zinc-800 w-full"></div>
          
          {/* Review Count */}
          <div className="text-center">
            <div className="text-lg font-bold text-ink dark:text-white mb-0.5">
              {book.pageCount ? `${book.pageCount}` : '2.4k'}
            </div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-500 uppercase tracking-wide">
              {book.pageCount ? 'Pages' : 'Reviews'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

