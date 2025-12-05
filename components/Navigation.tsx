import React from 'react';
import { BookOpen, BarChart2, Search, Shield, Moon, Sun, PlusCircle, Home, Library, Compass, Users, UserCircle } from 'lucide-react';
import { ViewState, User } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentUser: User | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAddBook: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, setView, currentUser, isDarkMode, toggleTheme, onAddBook 
}) => {
  // Build nav items based on authentication state
  const navItems = [];

  if (currentUser) {
    // Authenticated user navigation
    navItems.push(
      { id: ViewState.MY_SHELF, label: 'My Shelf', icon: <Library size={20} /> },
      { id: ViewState.DISCOVERY, label: 'Discovery', icon: <Search size={20} /> },
      { id: ViewState.GENRES, label: 'Genres', icon: <Compass size={20} /> },
      { id: ViewState.COMMUNITY, label: 'Community', icon: <Users size={20} /> },
      { id: ViewState.GROUPS, label: 'Groups', icon: <UserCircle size={20} /> },
      { id: ViewState.ANALYTICS, label: 'Reading Stats', icon: <BarChart2 size={20} /> }
    );
    
    // Admin gets moderation panel
    if (currentUser.role === 'admin') {
      navItems.push({ id: ViewState.ADMIN, label: 'Moderation', icon: <Shield size={20} /> });
    }
  } else {
    // Public navigation (not logged in)
    navItems.push(
      { id: ViewState.LANDING, label: 'Home', icon: <Home size={20} /> },
      { id: ViewState.DISCOVERY, label: 'Discovery', icon: <Search size={20} /> },
      { id: ViewState.GENRES, label: 'Genres', icon: <Compass size={20} /> },
      { id: ViewState.COMMUNITY, label: 'Community', icon: <Users size={20} /> }
    );
  }

  return (
    <div className="w-full md:w-72 bg-paper dark:bg-stone-900 border-r border-soft dark:border-stone-800 h-screen sticky top-0 flex flex-col p-6 shadow-sm z-10 transition-colors duration-300">
      <div className="mb-10 flex items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ink dark:bg-stone-700 text-paper rounded-lg flex items-center justify-center font-serif font-bold text-2xl shadow-lg transform -rotate-3">
            O
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink dark:text-stone-100">OhMyReads</h1>
        </div>
      </div>

      {/* Add Book button - only show when logged in */}
      {currentUser && (
        <button 
          onClick={onAddBook}
          className="w-full flex items-center justify-center gap-2 mb-8 px-4 py-3.5 bg-leaf hover:bg-ink text-white rounded-xl shadow-md transition-all font-bold text-sm tracking-wide transform hover:-translate-y-0.5"
        >
          <PlusCircle size={18} /> Add Book
        </button>
      )}

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
              ${currentView === item.id 
                ? 'bg-ink text-paper shadow-md dark:bg-stone-700 dark:text-stone-100' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-soft/50 dark:hover:bg-stone-800 hover:text-ink dark:hover:text-stone-200'
              }`}
          >
            <span className={`relative z-10 ${currentView === item.id ? 'text-accent' : 'text-stone-400 group-hover:text-ink dark:group-hover:text-stone-200'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm tracking-wide relative z-10">{item.label}</span>
            {currentView === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>}
          </button>
        ))}
      </nav>

      <div className="space-y-4 pt-6 border-t border-soft dark:border-stone-800">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-soft/50 dark:hover:bg-stone-800 transition-colors"
        >
          {isDarkMode ? <Sun size={20} className="text-accent" /> : <Moon size={20} />}
          <span className="font-medium text-sm tracking-wide">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
};
