import React from 'react';
import { ViewState } from '../types';
import { BookX, Home, Search, ArrowLeft, Compass } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (view: ViewState) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  const suggestions = [
    { label: 'Go Home', icon: <Home size={20} />, view: ViewState.LANDING, primary: true },
    { label: 'Discover Books', icon: <Search size={20} />, view: ViewState.DISCOVERY, primary: false },
    { label: 'Browse Genres', icon: <Compass size={20} />, view: ViewState.GENRES, primary: false },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <BookX size={64} className="text-accent" />
          </div>
          {/* Floating elements */}
          <div className="absolute top-0 left-1/4 w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg rotate-12 animate-pulse" />
          <div className="absolute bottom-4 right-1/4 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-bounce" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          Page Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
          Oops! It seems this page has wandered off to a different chapter. 
          Don't worry, even the best readers lose their place sometimes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {suggestions.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 ${
                item.primary
                  ? 'bg-ink dark:bg-accent text-white shadow-lg'
                  : 'bg-white dark:bg-stone-800 text-ink dark:text-stone-200 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Fun Quote */}
        <div className="mt-12 p-6 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800">
          <p className="text-stone-500 dark:text-stone-400 italic text-sm">
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          </p>
          <p className="text-stone-400 dark:text-stone-500 text-xs mt-2">— George R.R. Martin</p>
        </div>
      </div>
    </div>
  );
};

