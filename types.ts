export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  rating?: number;
  moods?: string[];
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  awards?: string[];
  series?: string;
  characters?: string[];
  // Affiliate & purchase links
  purchaseUrl?: string;
  isbn?: string;
  affiliateLinks?: {
    amazon?: string;
    bookshop?: string;
    custom?: string;
  };
}

export interface CurrentRead extends Book {
  progress: number;
  totalPages: number;
  startDate: string;
}

export interface ReadingStat {
  month: string;
  pagesRead: number;
  booksFinished: number;
}

export enum ViewState {
  LANDING = 'LANDING',
  MY_SHELF = 'MY_SHELF',
  DISCOVERY = 'DISCOVERY',
  GENRES = 'GENRES',
  ANALYTICS = 'ANALYTICS',
  COMMUNITY = 'COMMUNITY',
  GROUPS = 'GROUPS',
  USER_PROFILE = 'USER_PROFILE',
  CONTACT = 'CONTACT',
  FAQ = 'FAQ',
  PRIVACY = 'PRIVACY',
  ADMIN = 'ADMIN',
  BLOG = 'BLOG',
  NOT_FOUND = 'NOT_FOUND'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  avatar: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved';
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
}

// Phase 3: Social Features
export interface UserProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  joinDate: string;
  isPublic: boolean;
  stats: {
    booksRead: number;
    pagesRead: number;
    reviewsWritten: number;
    followers: number;
    following: number;
  };
  favoriteGenres: string[];
  currentlyReading?: Book;
  readerType?: string; // "Night Owl", "Speed Reader", etc.
}

export interface ReadingGroup {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  createdBy: string;
  createdAt: string;
  memberCount: number;
  isPublic: boolean;
  currentBook?: Book;
  tags: string[];
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'started_reading' | 'finished_book' | 'review' | 'joined_group' | 'achievement';
  content: string;
  bookId?: string;
  bookTitle?: string;
  bookCover?: string;
  timestamp: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  bookCount: number;
}

// Reading Goals & Streaks
export interface ReadingGoals {
  targetPagesPerDay: number;
  targetBooksPerYear: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  todayPagesRead: number;
  yearlyBooksRead: number;
  yearlyPagesRead: number;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  goals: ReadingGoals;
  favoriteGenres: string[];
  notifications: boolean;
}

// Extended User with subscription info for premium features
export interface ExtendedUser extends User {
  subscription?: 'free' | 'premium';
  email?: string;
}