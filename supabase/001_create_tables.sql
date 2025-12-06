-- OhMyReads Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  reader_type TEXT,
  favorite_genres TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- USER STATS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  books_read INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  reviews_written INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- BOOKS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  description TEXT,
  isbn TEXT,
  page_count INTEGER,
  published_date TEXT,
  genres TEXT[] DEFAULT '{}',
  average_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for book search
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books USING gin(to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS idx_books_isbn ON public.books(isbn);

-- ===========================================
-- USER BOOKS (Personal Library)
-- ===========================================
CREATE TYPE book_status AS ENUM ('want_to_read', 'reading', 'finished', 'dnf');

CREATE TABLE IF NOT EXISTS public.user_books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  status book_status DEFAULT 'want_to_read',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  finish_date DATE,
  personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_user_books_user ON public.user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON public.user_books(status);

-- ===========================================
-- REVIEWS TABLE
-- ===========================================
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  contains_spoilers BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  status review_status DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_book ON public.reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);

-- ===========================================
-- FOLLOWS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- ===========================================
-- READING GROUPS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.reading_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  member_count INTEGER DEFAULT 1,
  current_book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_public ON public.reading_groups(is_public);

-- ===========================================
-- GROUP MEMBERS TABLE
-- ===========================================
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.reading_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role member_role DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);

-- ===========================================
-- ACTIVITY FEED TABLE
-- ===========================================
CREATE TYPE activity_type AS ENUM ('started_reading', 'finished_book', 'review', 'joined_group', 'achievement', 'follow');

CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type activity_type NOT NULL,
  content TEXT NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  group_id UUID REFERENCES public.reading_groups(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_feed(created_at DESC);

-- ===========================================
-- TRIGGER: Auto-create profile on signup
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- TRIGGER: Update book average rating
-- ===========================================
CREATE OR REPLACE FUNCTION public.update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.books
  SET 
    average_rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id) 
      AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
      AND status = 'approved'
    )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_book_rating();

-- ===========================================
-- TRIGGER: Update follower counts
-- ===========================================
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_stats SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
    UPDATE public.user_stats SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_stats SET following_count = following_count - 1 WHERE user_id = OLD.follower_id;
    UPDATE public.user_stats SET followers_count = followers_count - 1 WHERE user_id = OLD.following_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_change ON public.follows;
CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE public.books IS 'Book catalog';
COMMENT ON TABLE public.user_books IS 'User personal library and reading status';
COMMENT ON TABLE public.reviews IS 'Book reviews by users';
COMMENT ON TABLE public.follows IS 'User follow relationships';
COMMENT ON TABLE public.reading_groups IS 'Book clubs and reading groups';
COMMENT ON TABLE public.activity_feed IS 'User activity for social feed';

