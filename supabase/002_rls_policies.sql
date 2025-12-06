-- OhMyReads Row Level Security Policies
-- Run this AFTER 001_create_tables.sql

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PROFILES POLICIES
-- ===========================================
-- Anyone can view public profiles
CREATE POLICY "Public profiles viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===========================================
-- USER STATS POLICIES
-- ===========================================
-- Anyone can view stats of public profiles
CREATE POLICY "Stats viewable for public profiles"
  ON public.user_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_stats.user_id 
      AND profiles.is_public = true
    )
  );

-- Users can view their own stats
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- ===========================================
-- BOOKS POLICIES
-- ===========================================
-- Anyone can view books
CREATE POLICY "Books viewable by everyone"
  ON public.books FOR SELECT
  USING (true);

-- Authenticated users can add books
CREATE POLICY "Authenticated users can add books"
  ON public.books FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ===========================================
-- USER BOOKS POLICIES
-- ===========================================
-- Users can view their own library
CREATE POLICY "Users can view own library"
  ON public.user_books FOR SELECT
  USING (auth.uid() = user_id);

-- Public library visible if profile is public
CREATE POLICY "Public library viewable"
  ON public.user_books FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_books.user_id 
      AND profiles.is_public = true
    )
  );

-- Users can manage their own library
CREATE POLICY "Users can insert own books"
  ON public.user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
  ON public.user_books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books"
  ON public.user_books FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- REVIEWS POLICIES
-- ===========================================
-- Anyone can view approved reviews
CREATE POLICY "Approved reviews viewable by everyone"
  ON public.reviews FOR SELECT
  USING (status = 'approved');

-- Users can view their own reviews (any status)
CREATE POLICY "Users can view own reviews"
  ON public.reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- FOLLOWS POLICIES
-- ===========================================
-- Anyone can view follows
CREATE POLICY "Follows viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

-- Authenticated users can follow others
CREATE POLICY "Users can follow"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ===========================================
-- READING GROUPS POLICIES
-- ===========================================
-- Anyone can view public groups
CREATE POLICY "Public groups viewable by everyone"
  ON public.reading_groups FOR SELECT
  USING (is_public = true);

-- Members can view private groups
CREATE POLICY "Members can view private groups"
  ON public.reading_groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_members.group_id = reading_groups.id 
      AND group_members.user_id = auth.uid()
    )
  );

-- Authenticated users can create groups
CREATE POLICY "Authenticated users can create groups"
  ON public.reading_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Owners/admins can update groups
CREATE POLICY "Owners can update groups"
  ON public.reading_groups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_members.group_id = reading_groups.id 
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  );

-- ===========================================
-- GROUP MEMBERS POLICIES
-- ===========================================
-- Anyone can view members of public groups
CREATE POLICY "Public group members viewable"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_groups 
      WHERE reading_groups.id = group_members.group_id 
      AND reading_groups.is_public = true
    )
  );

-- Members can view other members
CREATE POLICY "Members can view group members"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = auth.uid()
    )
  );

-- Users can join public groups
CREATE POLICY "Users can join public groups"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.reading_groups 
      WHERE reading_groups.id = group_members.group_id 
      AND reading_groups.is_public = true
    )
  );

-- Users can leave groups
CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- ACTIVITY FEED POLICIES
-- ===========================================
-- Anyone can view activity from public profiles
CREATE POLICY "Public activity viewable"
  ON public.activity_feed FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = activity_feed.user_id 
      AND profiles.is_public = true
    )
  );

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON public.activity_feed FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert activity (via triggers/functions)
CREATE POLICY "System can insert activity"
  ON public.activity_feed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

