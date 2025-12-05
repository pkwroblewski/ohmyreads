import React, { useState } from 'react';
import { ReadingGoals as ReadingGoalsType } from '../types';
import { Target, Flame, Trophy, TrendingUp, Settings, Check, X } from 'lucide-react';

interface ReadingGoalsProps {
  goals: ReadingGoalsType;
  onUpdateGoals: (pagesPerDay: number, booksPerYear: number) => void;
}

export const ReadingGoals: React.FC<ReadingGoalsProps> = ({ goals, onUpdateGoals }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pagesInput, setPagesInput] = useState(goals.targetPagesPerDay.toString());
  const [booksInput, setBooksInput] = useState(goals.targetBooksPerYear.toString());

  const dailyPercent = Math.min(100, Math.round((goals.todayPagesRead / goals.targetPagesPerDay) * 100));
  const yearlyPercent = Math.min(100, Math.round((goals.yearlyBooksRead / goals.targetBooksPerYear) * 100));
  const goalMet = goals.todayPagesRead >= goals.targetPagesPerDay;

  const handleSave = () => {
    const pages = parseInt(pagesInput) || goals.targetPagesPerDay;
    const books = parseInt(booksInput) || goals.targetBooksPerYear;
    onUpdateGoals(pages, books);
    setIsEditing(false);
  };

  return (
    <section 
      aria-label="Reading Goals" 
      className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 rounded-2xl p-6 border border-amber-100 dark:border-stone-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-ink dark:text-stone-100 flex items-center gap-2">
          <Target size={20} className="text-accent" />
          Reading Goals
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-stone-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-stone-700 rounded-lg transition-colors"
          aria-label="Edit goals"
        >
          <Settings size={16} />
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">
                Pages / Day
              </label>
              <input
                type="number"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg text-center font-bold outline-none focus:border-accent text-ink dark:text-white"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">
                Books / Year
              </label>
              <input
                type="number"
                value={booksInput}
                onChange={(e) => setBooksInput(e.target.value)}
                className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg text-center font-bold outline-none focus:border-accent text-ink dark:text-white"
                min="1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-accent text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Daily Progress */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Today's Progress</span>
              {goalMet && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Check size={12} /> Goal Met!
                </span>
              )}
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-ink dark:text-white">{goals.todayPagesRead}</span>
              <span className="text-stone-400 pb-1">/ {goals.targetPagesPerDay} pages</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${goalMet ? 'bg-emerald-500' : 'bg-accent'}`}
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Streak */}
            <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-100 dark:border-stone-700 text-center">
              <Flame size={20} className={`mx-auto mb-1 ${goals.currentStreak > 0 ? 'text-orange-500' : 'text-stone-300 dark:text-stone-600'}`} />
              <div className="text-xl font-bold text-ink dark:text-white">{goals.currentStreak}</div>
              <div className="text-xs text-stone-400">Day Streak</div>
            </div>

            {/* Yearly Books */}
            <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-100 dark:border-stone-700 text-center">
              <Trophy size={20} className="mx-auto mb-1 text-amber-500" />
              <div className="text-xl font-bold text-ink dark:text-white">
                {goals.yearlyBooksRead}/{goals.targetBooksPerYear}
              </div>
              <div className="text-xs text-stone-400">Books This Year</div>
            </div>

            {/* Total Pages */}
            <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-100 dark:border-stone-700 text-center">
              <TrendingUp size={20} className="mx-auto mb-1 text-emerald-500" />
              <div className="text-xl font-bold text-ink dark:text-white">
                {goals.yearlyPagesRead.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400">Pages Read</div>
            </div>
          </div>

          {/* Yearly Progress Bar */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-100 dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Yearly Goal Progress</span>
              <span className="text-xs font-bold text-ink dark:text-white">{yearlyPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                style={{ width: `${yearlyPercent}%` }}
              />
            </div>
          </div>

          {/* Longest Streak Badge */}
          {goals.longestStreak > 0 && (
            <div className="text-center text-xs text-stone-400">
              Personal best: <span className="font-bold text-orange-500">{goals.longestStreak} day</span> streak
            </div>
          )}
        </div>
      )}
    </section>
  );
};

