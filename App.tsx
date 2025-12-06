import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { MyShelf } from './pages/MyShelf';
import { Discovery } from './pages/Discovery';
import { Genres } from './pages/Genres';
import { Analytics } from './pages/Analytics';
import { Community } from './pages/Community';
import { Groups } from './pages/Groups';
import { UserProfilePage } from './pages/UserProfile';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/AdminDashboard';
import { Blog } from './pages/Blog';
import { AILibrarian } from './components/AILibrarian';
import { BookDetailsModal } from './components/BookDetailsModal';
import { AuthModal } from './components/AuthModal';
import { AddBookModal } from './components/AddBookModal';
import { ViewState, Book, User, CurrentRead, ReadingGoals, ExtendedUser } from './types';
import { ReadingService, LibraryService, GoalsService, UserService } from './services/mockBackend';
import { initAnalytics, trackPageView, trackBookEvent, trackEvent } from './lib/analytics';
import { VIEW_PATHS } from './lib/constants';
import { Check, X, LogIn, LogOut, FileText, ArrowLeft, UserPlus } from 'lucide-react';

function App() {
  // Default to LANDING for public users
  const [currentView, setView] = useState<ViewState>(ViewState.LANDING);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });
  
  // State for Currently Reading & Library
  const [currentRead, setCurrentRead] = useState<CurrentRead | null>(null);
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  
  // Reading Goals State
  const [readingGoals, setReadingGoals] = useState<ReadingGoals>(GoalsService.get());
  
  // AI Librarian State (for contextual entry points)
  const [isAILibrarianOpen, setIsAILibrarianOpen] = useState(false);
  const [aiLibrarianInitialMessage, setAiLibrarianInitialMessage] = useState<string | undefined>();

  // Handler for opening AI Librarian with context
  const handleAskConcierge = (query: string) => {
    setAiLibrarianInitialMessage(query);
    setIsAILibrarianOpen(true);
  };
  
  // Handler for toggling AI Librarian
  const handleAILibrarianToggle = (open: boolean) => {
    setIsAILibrarianOpen(open);
    if (!open) {
      // Clear initial message when closed
      setAiLibrarianInitialMessage(undefined);
    }
  };

  // Initialize analytics and load persisted state on mount
  useEffect(() => {
    initAnalytics();
    
    // Load persisted user
    const savedUser = UserService.get();
    if (savedUser) {
      setCurrentUser(savedUser);
      setView(ViewState.MY_SHELF);
    }
    
    // Load other persisted state
    setCurrentRead(ReadingService.get());
    setLibraryBooks(LibraryService.getAll());
    setReadingGoals(GoalsService.get());
  }, []);
  
  // Track page views when view changes
  useEffect(() => {
    const path = VIEW_PATHS[currentView] || '/';
    trackPageView(path);
  }, [currentView]);

  // Handle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showToast = (message: string) => {
      setToast({ message, visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const handleNavigation = (view: ViewState) => {
    // Protect private routes - redirect to auth if not logged in
    if (!currentUser && (view === ViewState.MY_SHELF || view === ViewState.ANALYTICS || view === ViewState.GROUPS)) {
      handleSignIn();
      return;
    }
    setView(view);
  };

  const handleLogin = (user: User) => {
    const extendedUser: ExtendedUser = { ...user, subscription: 'free' };
    setCurrentUser(extendedUser);
    UserService.save(extendedUser);
    // Redirect to My Shelf after login
    setView(ViewState.MY_SHELF);
    trackEvent('sign_in');
    showToast(`Welcome back, ${user.name}!`);
  };

  // Open auth modal in signin mode
  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthOpen(true);
  };

  // Open auth modal in signup mode
  const handleSignUp = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };
  
  // Track when user views a book
  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    trackBookEvent('view', book.title);
  };

  const handleStartReading = (book: Book) => {
      const newRead = ReadingService.set(book);
      setCurrentRead(newRead);
      setSelectedBook(null);
      // If user is logged in, go to My Shelf; otherwise go to Landing
      setView(currentUser ? ViewState.MY_SHELF : ViewState.LANDING);
      trackBookEvent('start', book.title);
      showToast(`Started reading "${book.title}"`);
  };

  const handleUpdateProgress = (pages: number) => {
      const previousProgress = currentRead?.progress || 0;
      const updated = ReadingService.updateProgress(pages);
      if (updated) {
        setCurrentRead(updated);
        // Calculate pages read in this session and log to goals
        const pagesReadNow = Math.max(0, pages - previousProgress);
        if (pagesReadNow > 0) {
          const updatedGoals = GoalsService.logReading(pagesReadNow);
          setReadingGoals(updatedGoals);
        }
      }
      showToast("Reading progress updated!");
  };

  const handleFinishBook = () => {
      if(confirm("Congratulations on finishing the book! Move it to your completed shelf?")) {
          const bookTitle = currentRead?.title;
          ReadingService.finish();
          setCurrentRead(null);
          // Update yearly book count
          const updatedGoals = GoalsService.completeBook();
          setReadingGoals(updatedGoals);
          trackBookEvent('complete', bookTitle);
          showToast("Book finished! Added to your history.");
      }
  };

  const handleAddBook = (bookData: Partial<Book>) => {
      const newBook = LibraryService.add(bookData);
      setLibraryBooks(prev => [newBook, ...prev]);
      trackBookEvent('add', newBook.title);
      showToast("Book added to your library.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    UserService.clear();
    // Redirect to public landing page
    setView(ViewState.LANDING);
    trackEvent('sign_out');
    showToast("You have been logged out.");
  }
  
  // Handle updating reading goals
  const handleUpdateGoals = (pagesPerDay: number, booksPerYear: number) => {
    const updatedGoals = GoalsService.updateGoals(pagesPerDay, booksPerYear);
    setReadingGoals(updatedGoals);
    showToast("Reading goals updated!");
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return (
          <Landing 
            onBookClick={handleBookSelect}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
          />
        );
      case ViewState.MY_SHELF:
        if (!currentUser) {
          return <Landing onBookClick={handleBookSelect} onSignIn={handleSignIn} onSignUp={handleSignUp} />;
        }
        return (
          <MyShelf 
            user={currentUser}
            onBookClick={handleBookSelect}
            currentRead={currentRead}
            onUpdateProgress={handleUpdateProgress}
            onFinishBook={handleFinishBook}
            onFindBook={() => setView(ViewState.DISCOVERY)}
            libraryBooks={libraryBooks}
            onAddBook={() => setIsAddBookOpen(true)}
            readingGoals={readingGoals}
            onUpdateGoals={handleUpdateGoals}
            onAskConcierge={handleAskConcierge}
          />
        );
      case ViewState.DISCOVERY:
        return <Discovery onBookClick={handleBookSelect} />;
      case ViewState.GENRES:
        return <Genres onBookClick={handleBookSelect} />;
      case ViewState.COMMUNITY:
        return (
          <Community 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            onSignIn={handleSignIn}
          />
        );
      case ViewState.GROUPS:
        return (
          <Groups 
            currentUser={currentUser}
            onSignIn={handleSignIn}
          />
        );
      case ViewState.USER_PROFILE:
        return (
          <UserProfilePage 
            profileUser={null}
            currentUser={currentUser}
            onBookClick={handleBookSelect}
            onNavigate={handleNavigation}
          />
        );
      case ViewState.ANALYTICS:
        if (!currentUser) {
          return <Landing onBookClick={handleBookSelect} onSignIn={handleSignIn} onSignUp={handleSignUp} />;
        }
        return <Analytics />;
      case ViewState.CONTACT:
        return <Contact />;
      case ViewState.FAQ:
        return <FAQ onNavigate={handleNavigation} />;
      case ViewState.PRIVACY:
        return <Privacy />;
      case ViewState.ADMIN:
        return currentUser?.role === 'admin' ? <AdminDashboard /> : <div className="text-center p-10 text-stone-500">Access Denied</div>;
      case ViewState.BLOG:
        return <Blog currentUser={currentUser} />;
      case ViewState.NOT_FOUND:
        return <NotFound onNavigate={handleNavigation} />;
      default:
        return <Landing onBookClick={handleBookSelect} onSignIn={handleSignIn} onSignUp={handleSignUp} />;
    }
  };

  // Determine where the blog back button should go
  const getBackDestination = () => {
    return currentUser ? ViewState.MY_SHELF : ViewState.LANDING;
  };

  return (
    <div className="flex min-h-screen bg-paper dark:bg-stone-950 font-sans selection:bg-accent/30 transition-colors duration-300 relative">
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-[80] transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <div className="bg-ink dark:bg-stone-800 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-stone-700 dark:border-stone-600 min-w-[300px]">
             <div className="w-8 h-8 bg-leaf rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/20">
                 <Check size={18} strokeWidth={3} />
             </div>
             <div className="flex-1">
                 <p className="font-bold text-sm">Success</p>
                 <p className="text-xs text-stone-300 leading-snug">{toast.message}</p>
             </div>
             <button 
                onClick={() => setToast(prev => ({...prev, visible: false}))} 
                className="text-stone-400 hover:text-white transition-colors p-1 rounded-full hover:bg-stone-700"
             >
                 <X size={16} />
             </button>
          </div>
      </div>

      <Navigation 
        currentView={currentView} 
        setView={handleNavigation} 
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onAddBook={() => {
          if (currentUser) {
            setIsAddBookOpen(true);
          } else {
            handleSignUp();
          }
        }}
      />
      
      <main className="flex-1 h-screen overflow-y-auto scroll-smooth relative flex flex-col">
        {/* Top Header Bar for Authentication & Blog */}
        <div className="sticky top-0 z-40 px-6 py-4 md:px-12 bg-paper/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-soft dark:border-stone-800 flex justify-end gap-4 items-center">
            
            {/* OhMyBlog Button / Back Button */}
            <button 
                onClick={() => setView(currentView === ViewState.BLOG ? getBackDestination() : ViewState.BLOG)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all
                    ${currentView === ViewState.BLOG 
                        ? 'bg-stone-200 dark:bg-stone-700 text-ink dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-600' 
                        : 'bg-white dark:bg-stone-900 text-ink dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-accent hover:text-accent'
                    }`}
            >
                {currentView === ViewState.BLOG ? (
                    <>
                        <ArrowLeft size={18} /> {currentUser ? 'Back to Shelf' : 'Back Home'}
                    </>
                ) : (
                    <>
                        <FileText size={18} /> OhMyBlog
                    </>
                )}
            </button>

            {currentUser ? (
               <div className="flex items-center gap-4 animate-fade-in">
                  <div className="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm">
                      <span className="text-sm font-bold text-ink dark:text-stone-100">{currentUser.name}</span>
                      <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full object-cover border border-stone-100 dark:border-stone-600" />
                  </div>
                  <button 
                      onClick={handleLogout}
                      className="p-2.5 text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-full"
                      title="Logout"
                  >
                      <LogOut size={20} />
                  </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                    onClick={handleSignIn}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-stone-800 text-ink dark:text-stone-200 font-bold text-sm border border-stone-200 dark:border-stone-700 hover:border-accent hover:text-accent transition-all"
                >
                    <LogIn size={18} /> Sign In
                </button>
                <button 
                    onClick={handleSignUp}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink dark:bg-accent text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <UserPlus size={18} /> Get Started
                </button>
              </div>
            )}
        </div>

        <div className="p-6 md:p-12 md:pt-6 max-w-6xl mx-auto w-full flex-1">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <Footer onNavigate={handleNavigation} />
      </main>

      <AILibrarian 
        onBookClick={handleBookSelect}
        isOpen={isAILibrarianOpen}
        onToggle={handleAILibrarianToggle}
        initialMessage={aiLibrarianInitialMessage}
      />

      {selectedBook && (
          <BookDetailsModal 
             book={selectedBook} 
             isOpen={!!selectedBook} 
             onClose={() => setSelectedBook(null)}
             currentUser={currentUser}
             onLoginReq={handleSignIn}
             onStartReading={handleStartReading}
             onAskConcierge={handleAskConcierge}
          />
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin}
        initialMode={authMode}
      />

      <AddBookModal 
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}

export default App;