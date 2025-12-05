import { Review, User, Book, CurrentRead, BlogPost, ReadingGoals, ExtendedUser } from '../types';
import { db, STORAGE_KEYS, generateId, getTimestamp } from '../lib/database';
import { READING_GOALS } from '../lib/constants';

// Initial Mock Data
const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Alice Reader', role: 'user', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: 'admin1', name: 'Biblios Admin', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' }
];

// Use centralized storage keys
const LOCAL_STORAGE_REVIEWS_KEY = STORAGE_KEYS.REVIEWS;
const LOCAL_STORAGE_READING_KEY = STORAGE_KEYS.CURRENT_READ;
const LOCAL_STORAGE_LIBRARY_KEY = STORAGE_KEYS.LIBRARY;
const LOCAL_STORAGE_BLOG_KEY = STORAGE_KEYS.BLOG;

export const AuthService = {
    login: async (username: string): Promise<User | null> => {
        // Simple mock login logic
        if (username.toLowerCase() === 'admin') return MOCK_USERS[1];
        if (username.toLowerCase() === 'alice') return MOCK_USERS[0];
        // Create a new user for anyone else
        return {
            id: `u-${Date.now()}`,
            name: username,
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        };
    }
};

export const ReviewService = {
    getReviewsForBook: (bookId: string): Review[] => {
        const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY) || '[]');
        return all.filter((r: Review) => r.bookId === bookId && r.status === 'approved');
    },

    getReviewsForBookWithUserContext: (bookId: string, userId?: string): Review[] => {
        const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY) || '[]');
        return all.filter((r: Review) => 
            r.bookId === bookId && 
            (r.status === 'approved' || (userId && r.userId === userId))
        );
    },

    getPendingReviews: (): Review[] => {
        const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY) || '[]');
        return all.filter((r: Review) => r.status === 'pending');
    },

    addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => {
        const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY) || '[]');
        const newReview: Review = {
            ...review,
            id: `rev-${Date.now()}`,
            date: new Date().toISOString(),
            status: 'pending' // Default to pending for moderation
        };
        localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify([...all, newReview]));
        return newReview;
    },

    approveReview: (reviewId: string) => {
        const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY) || '[]');
        const updated = all.map((r: Review) => r.id === reviewId ? { ...r, status: 'approved' } : r);
        localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    },

    deleteReview: (reviewId: string) => {
        const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY) || '[]');
        const updated = all.filter((r: Review) => r.id !== reviewId);
        localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    }
};

export const ReadingService = {
    get: (): CurrentRead | null => {
        const stored = localStorage.getItem(LOCAL_STORAGE_READING_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    set: (book: Book): CurrentRead => {
        const newRead: CurrentRead = {
            ...book,
            progress: 0,
            totalPages: book.pageCount || 300, // Default if unknown
            startDate: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_READING_KEY, JSON.stringify(newRead));
        return newRead;
    },

    updateProgress: (pages: number): CurrentRead | null => {
        const current = ReadingService.get();
        if (!current) return null;
        
        const updated = { ...current, progress: Math.min(pages, current.totalPages) };
        localStorage.setItem(LOCAL_STORAGE_READING_KEY, JSON.stringify(updated));
        return updated;
    },

    finish: () => {
        localStorage.removeItem(LOCAL_STORAGE_READING_KEY);
    }
};

export const LibraryService = {
    getAll: (): Book[] => {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIBRARY_KEY) || '[]');
    },

    add: (bookData: Partial<Book>): Book => {
        const all = LibraryService.getAll();
        const newBook: Book = {
            id: `manual-${Date.now()}`,
            title: bookData.title || 'Untitled',
            author: bookData.author || 'Unknown',
            coverUrl: bookData.coverUrl || '',
            description: bookData.description || '',
            pageCount: bookData.pageCount || 0,
            publishedDate: bookData.publishedDate || new Date().getFullYear().toString(),
            moods: [],
            rating: 0,
            awards: [],
            series: '',
            characters: []
        };
        localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify([newBook, ...all]));
        return newBook;
    },
    
    remove: (id: string) => {
        const all = LibraryService.getAll();
        const updated = all.filter(b => b.id !== id);
        localStorage.setItem(LOCAL_STORAGE_LIBRARY_KEY, JSON.stringify(updated));
    }
};

export const BlogService = {
    getAll: (): BlogPost[] => {
        const stored = localStorage.getItem(LOCAL_STORAGE_BLOG_KEY);
        // Pre-populate with a welcome post if empty
        if (!stored) {
            const initialPost: BlogPost = {
                id: 'welcome-1',
                title: 'Welcome to OhMyBlog!',
                content: "This is the space where we share our thoughts on the latest literary trends, hidden gems, and the joy of reading. Stay tuned for updates from the editors!",
                author: 'Biblios Admin',
                date: new Date().toISOString(),
            };
            return [initialPost];
        }
        return JSON.parse(stored);
    },

    add: (postData: Omit<BlogPost, 'id' | 'date'>): BlogPost => {
        const all = BlogService.getAll();
        const newPost: BlogPost = {
            ...postData,
            id: `post-${Date.now()}`,
            date: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify([newPost, ...all]));
        return newPost;
    },

    delete: (id: string) => {
        const all = BlogService.getAll();
        const updated = all.filter(p => p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(updated));
    }
};

// Reading Goals & Streaks Service
const getDefaultGoals = (): ReadingGoals => ({
    targetPagesPerDay: READING_GOALS.defaultPagesPerDay,
    targetBooksPerYear: READING_GOALS.defaultBooksPerYear,
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: null,
    todayPagesRead: 0,
    yearlyBooksRead: 0,
    yearlyPagesRead: 0,
});

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
};

export const GoalsService = {
    get: (): ReadingGoals => {
        const stored = localStorage.getItem(STORAGE_KEYS.READING_GOALS);
        if (!stored) return getDefaultGoals();
        
        const goals: ReadingGoals = JSON.parse(stored);
        
        // Reset today's pages if it's a new day
        if (goals.lastReadDate) {
            const lastRead = new Date(goals.lastReadDate);
            const now = new Date();
            
            if (!isSameDay(lastRead, now)) {
                goals.todayPagesRead = 0;
                
                // Check if streak should be maintained or reset
                if (!isYesterday(lastRead)) {
                    // More than a day has passed - reset streak
                    goals.currentStreak = 0;
                }
            }
        }
        
        return goals;
    },

    save: (goals: ReadingGoals): void => {
        localStorage.setItem(STORAGE_KEYS.READING_GOALS, JSON.stringify(goals));
    },

    updateGoals: (targetPagesPerDay: number, targetBooksPerYear: number): ReadingGoals => {
        const goals = GoalsService.get();
        goals.targetPagesPerDay = targetPagesPerDay;
        goals.targetBooksPerYear = targetBooksPerYear;
        GoalsService.save(goals);
        return goals;
    },

    logReading: (pagesRead: number): ReadingGoals => {
        const goals = GoalsService.get();
        const now = new Date();
        const today = now.toISOString();
        
        // Check if this is first read today
        const isFirstReadToday = !goals.lastReadDate || 
            !isSameDay(new Date(goals.lastReadDate), now);
        
        if (isFirstReadToday) {
            // Check if streak continues from yesterday
            if (goals.lastReadDate && isYesterday(new Date(goals.lastReadDate))) {
                goals.currentStreak += 1;
            } else if (!goals.lastReadDate || !isYesterday(new Date(goals.lastReadDate))) {
                // Start new streak (either first ever or gap > 1 day)
                goals.currentStreak = 1;
            }
            
            // Update longest streak
            if (goals.currentStreak > goals.longestStreak) {
                goals.longestStreak = goals.currentStreak;
            }
        }
        
        goals.todayPagesRead += pagesRead;
        goals.yearlyPagesRead += pagesRead;
        goals.lastReadDate = today;
        
        GoalsService.save(goals);
        return goals;
    },

    completeBook: (): ReadingGoals => {
        const goals = GoalsService.get();
        goals.yearlyBooksRead += 1;
        GoalsService.save(goals);
        return goals;
    },

    getProgress: (): { dailyPercent: number; yearlyPercent: number; streakDays: number; goalMet: boolean } => {
        const goals = GoalsService.get();
        const dailyPercent = Math.min(100, Math.round((goals.todayPagesRead / goals.targetPagesPerDay) * 100));
        const yearlyPercent = Math.min(100, Math.round((goals.yearlyBooksRead / goals.targetBooksPerYear) * 100));
        
        return {
            dailyPercent,
            yearlyPercent,
            streakDays: goals.currentStreak,
            goalMet: goals.todayPagesRead >= goals.targetPagesPerDay,
        };
    },

    reset: (): void => {
        localStorage.removeItem(STORAGE_KEYS.READING_GOALS);
    }
};

// User Persistence Service
export const UserService = {
    get: (): ExtendedUser | null => {
        const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return stored ? JSON.parse(stored) : null;
    },

    save: (user: ExtendedUser): void => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },

    clear: (): void => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    // Get user stats for profile display
    getStats: (): { booksRead: number; pagesRead: number; reviewsWritten: number } => {
        const goals = GoalsService.get();
        const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
        const user = UserService.get();
        
        const userReviews = user 
            ? reviews.filter((r: Review) => r.userId === user.id)
            : [];
        
        return {
            booksRead: goals.yearlyBooksRead,
            pagesRead: goals.yearlyPagesRead,
            reviewsWritten: userReviews.length,
        };
    }
};