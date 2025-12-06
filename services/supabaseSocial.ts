/**
 * Social Service - Supabase Operations
 * Handles follows, activity feed, and social interactions
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ActivityFeedItem, UserProfile } from '../types';

export interface FollowStatus {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export const SocialService = {
  // ==========================================
  // FOLLOW OPERATIONS
  // ==========================================

  /**
   * Follow a user
   */
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    if (followerId === followingId) return false;

    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (error) {
      if (error.code === '23505') return true; // Already following
      console.error('Error following user:', error);
      return false;
    }

    // Create activity
    await supabase.from('activity_feed').insert({
      user_id: followerId,
      type: 'follow',
      content: `started following`,
      metadata: { followed_user_id: followingId }
    });

    return true;
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }

    return true;
  },

  /**
   * Check if user is following another user
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking follow status:', error);
    }

    return !!data;
  },

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string): Promise<Partial<UserProfile>[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('follows')
      .select(`
        profiles:follower_id (
          id,
          username,
          display_name,
          avatar_url,
          bio
        )
      `)
      .eq('following_id', userId);

    if (error) {
      console.error('Error fetching followers:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.profiles?.id,
      username: item.profiles?.username,
      displayName: item.profiles?.display_name,
      avatar: item.profiles?.avatar_url,
      bio: item.profiles?.bio,
    }));
  },

  /**
   * Get users that a user is following
   */
  async getFollowing(userId: string): Promise<Partial<UserProfile>[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('follows')
      .select(`
        profiles:following_id (
          id,
          username,
          display_name,
          avatar_url,
          bio
        )
      `)
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.profiles?.id,
      username: item.profiles?.username,
      displayName: item.profiles?.display_name,
      avatar: item.profiles?.avatar_url,
      bio: item.profiles?.bio,
    }));
  },

  // ==========================================
  // ACTIVITY FEED OPERATIONS
  // ==========================================

  /**
   * Get activity feed for a user (from people they follow)
   */
  async getActivityFeed(userId: string, limit = 20): Promise<ActivityFeedItem[]> {
    if (!isSupabaseConfigured()) return [];

    // Get list of followed users
    const { data: following } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    const followedIds = (following || []).map(f => f.following_id);
    followedIds.push(userId); // Include own activity

    const { data, error } = await supabase
      .from('activity_feed')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        books:book_id (title, cover_url)
      `)
      .in('user_id', followedIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity feed:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.profiles?.username || 'User',
      userAvatar: item.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`,
      type: item.type,
      content: item.content,
      bookId: item.book_id,
      bookTitle: item.books?.title,
      bookCover: item.books?.cover_url,
      timestamp: item.created_at,
    }));
  },

  /**
   * Get public activity feed (for non-logged in users)
   */
  async getPublicActivityFeed(limit = 20): Promise<ActivityFeedItem[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('activity_feed')
      .select(`
        *,
        profiles:user_id (username, avatar_url, is_public),
        books:book_id (title, cover_url)
      `)
      .eq('profiles.is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching public feed:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.profiles?.username || 'User',
      userAvatar: item.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`,
      type: item.type,
      content: item.content,
      bookId: item.book_id,
      bookTitle: item.books?.title,
      bookCover: item.books?.cover_url,
      timestamp: item.created_at,
    }));
  },

  /**
   * Get user's own activity
   */
  async getUserActivity(userId: string, limit = 20): Promise<ActivityFeedItem[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('activity_feed')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        books:book_id (title, cover_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.profiles?.username || 'User',
      userAvatar: item.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`,
      type: item.type,
      content: item.content,
      bookId: item.book_id,
      bookTitle: item.books?.title,
      bookCover: item.books?.cover_url,
      timestamp: item.created_at,
    }));
  },

  // ==========================================
  // PROFILE OPERATIONS
  // ==========================================

  /**
   * Get user profile by username
   */
  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_stats (*)
      `)
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data ? {
      id: data.id,
      userId: data.id,
      username: data.username,
      displayName: data.display_name || data.username,
      bio: data.bio || '',
      avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`,
      coverImage: data.cover_image_url,
      joinDate: data.created_at,
      isPublic: data.is_public,
      stats: {
        booksRead: data.user_stats?.books_read || 0,
        pagesRead: data.user_stats?.pages_read || 0,
        reviewsWritten: data.user_stats?.reviews_written || 0,
        followers: data.user_stats?.followers_count || 0,
        following: data.user_stats?.following_count || 0,
      },
      favoriteGenres: data.favorite_genres || [],
      readerType: data.reader_type,
    } : null;
  },

  /**
   * Get featured/active members
   */
  async getFeaturedMembers(limit = 6): Promise<Partial<UserProfile>[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_stats (*)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured members:', error);
      return [];
    }

    return (data || []).map(profile => ({
      id: profile.id,
      userId: profile.id,
      username: profile.username,
      displayName: profile.display_name || profile.username,
      avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
      readerType: profile.reader_type,
      stats: {
        booksRead: profile.user_stats?.books_read || 0,
        pagesRead: profile.user_stats?.pages_read || 0,
        reviewsWritten: profile.user_stats?.reviews_written || 0,
        followers: profile.user_stats?.followers_count || 0,
        following: profile.user_stats?.following_count || 0,
      },
    }));
  },

  // ==========================================
  // REAL-TIME SUBSCRIPTIONS
  // ==========================================

  /**
   * Subscribe to activity feed updates
   */
  subscribeToActivity(userId: string, callback: (activity: ActivityFeedItem) => void) {
    if (!isSupabaseConfigured()) return { unsubscribe: () => {} };

    const channel = supabase
      .channel('activity-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed',
        },
        async (payload) => {
          // Fetch full activity with profile
          const { data } = await supabase
            .from('activity_feed')
            .select(`
              *,
              profiles:user_id (username, avatar_url),
              books:book_id (title, cover_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            callback({
              id: data.id,
              userId: data.user_id,
              userName: data.profiles?.username || 'User',
              userAvatar: data.profiles?.avatar_url || '',
              type: data.type,
              content: data.content,
              bookId: data.book_id,
              bookTitle: data.books?.title,
              bookCover: data.books?.cover_url,
              timestamp: data.created_at,
            });
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  },
};

