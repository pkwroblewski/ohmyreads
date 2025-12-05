/**
 * Database Schema Types
 * 
 * These types are designed to be compatible with Supabase.
 * When migrating, these can be generated from your Supabase schema.
 */

// User table schema
export interface DbUser {
  id: string;
  email?: string;
  name: string;
  avatar_url: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Book table schema (for user's library)
export interface DbBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_url?: string;
  description?: string;
  page_count?: number;
  published_date?: string;
  isbn?: string;
  rating?: number;
  status: 'want_to_read' | 'reading' | 'completed';
  progress?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Review table schema
export interface DbReview {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Blog post table schema
export interface DbBlogPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  slug: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Reading session for analytics
export interface DbReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  pages_read: number;
  duration_minutes: number;
  created_at: string;
}

/**
 * Supabase Database Schema (for reference when setting up)
 * 
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email TEXT UNIQUE,
 *   name TEXT NOT NULL,
 *   avatar_url TEXT,
 *   role TEXT DEFAULT 'user',
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE books (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 *   title TEXT NOT NULL,
 *   author TEXT NOT NULL,
 *   cover_url TEXT,
 *   description TEXT,
 *   page_count INTEGER,
 *   published_date TEXT,
 *   isbn TEXT,
 *   rating DECIMAL(2,1),
 *   status TEXT DEFAULT 'want_to_read',
 *   progress INTEGER DEFAULT 0,
 *   started_at TIMESTAMPTZ,
 *   completed_at TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE TABLE reviews (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 *   book_id UUID NOT NULL,
 *   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
 *   comment TEXT,
 *   status TEXT DEFAULT 'pending',
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

