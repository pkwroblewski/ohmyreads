import React from 'react';
import { Trophy, Target, Flame, ChevronRight } from 'lucide-react';

interface ReadingChallengeWidgetProps {
  booksRead: number;
  booksGoal: number;
  currentStreak?: number;
  onViewDetails?: () => void;
  onSetGoal?: () => void;
  compact?: boolean;
}

export const ReadingChallengeWidget: React.FC<ReadingChallengeWidgetProps> = ({
  booksRead,
  booksGoal,
  currentStreak = 0,
  onViewDetails,
  onSetGoal,
  compact = false
}) => {
  const progress = Math.min((booksRead / booksGoal) * 100, 100);
  const currentYear = new Date().getFullYear();
  const isOnTrack = progress >= (new Date().getMonth() + 1) / 12 * 100;

  if (compact) {
    return (
      <div 
        onClick={onViewDetails}
        className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-950 border border-amber-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-600 dark:text-yellow-500" />
            <span className="text-sm font-semibold text-ink dark:text-white">{currentYear} Challenge</span>
          </div>
          <ChevronRight size={16} className="text-stone-400 dark:text-zinc-500 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-ink dark:text-white">{booksRead}</span>
          <span className="text-sm text-stone-500 dark:text-zinc-400">/ {booksGoal} books</span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-zinc-800 rounded-full h-1.5">
          <div 
            className="h-full bg-amber-500 dark:bg-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-b from-amber-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 border border-amber-200 dark:border-zinc-800 rounded-xl relative overflow-hidden">
      {/* Decorative Trophy Background */}
      <div className="absolute top-0 right-0 p-3 opacity-5 dark:opacity-10">
        <Trophy size={100} />
      </div>
      
      {/* Header */}
      <div className="relative z-10">
        <h3 className="text-base font-bold text-ink dark:text-white mb-1 flex items-center gap-2">
          <Trophy size={18} className="text-amber-600 dark:text-yellow-500" />
          {currentYear} Reading Challenge
        </h3>
        <p className="text-xs text-stone-500 dark:text-zinc-500 mb-4">
          {isOnTrack ? "You're on track! Keep it up." : "You can do it! Keep reading."}
        </p>
        
        {/* Progress Display */}
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-ink dark:text-white tracking-tighter">{booksRead}</span>
          <span className="text-sm text-stone-500 dark:text-zinc-500 mb-1">/ {booksGoal} books</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-stone-200 dark:bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 dark:from-yellow-500 dark:to-amber-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Streak (if applicable) */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {currentStreak} day streak!
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <button 
              onClick={onViewDetails}
              className="flex-1 py-2 text-xs font-medium text-stone-600 dark:text-zinc-300 bg-stone-100 dark:bg-zinc-800/50 hover:bg-stone-200 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg transition-colors"
            >
              View Details
            </button>
          )}
          {onSetGoal && (
            <button 
              onClick={onSetGoal}
              className="flex-1 py-2 text-xs font-medium text-amber-700 dark:text-yellow-300 bg-amber-100 dark:bg-yellow-900/20 hover:bg-amber-200 dark:hover:bg-yellow-900/30 border border-amber-300 dark:border-yellow-700/50 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Target size={12} />
              Set Goal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

