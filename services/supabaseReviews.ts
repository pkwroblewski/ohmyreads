/**
 * Reviews Service - Supabase Operations
 * Handles all review-related database operations
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Review as DbReview } from '../types/database';
import type { Review } from '../types';

// Convert database review to app review format
const toAppReview = (dbReview: DbReview & { profiles?: { username: string; avatar_url: string } }): Review => ({
  id: dbReview.id,
  bookId: dbReview.book_id,
  userId: dbReview.user_id,
  userName: dbReview.profiles?.username || 'Anonymous',
  userAvatar: dbReview.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbReview.user_id}`,
  rating: dbReview.rating,
  comment: dbReview.content || '',
  date: dbReview.created_at,
  status: dbReview.status,
});

export const ReviewsService = {
  /**
   * Get reviews for a book
   */
  async getBookReviews(bookId: string): Promise<Review[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('book_id', bookId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return (data || []).map(toAppReview);
  },

  /**
   * Get reviews by a user
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }

    return (data || []).map(toAppReview);
  },

  /**
   * Add a new review
   */
  async addReview(review: {
    bookId: string;
    userId: string;
    rating: number;
    title?: string;
    content?: string;
    containsSpoilers?: boolean;
  }): Promise<Review | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        book_id: review.bookId,
        user_id: review.userId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        contains_spoilers: review.containsSpoilers || false,
        status: 'approved', // Auto-approve for now
      })
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Error adding review:', error);
      return null;
    }

    // Create activity feed entry
    await supabase.from('activity_feed').insert({
      user_id: review.userId,
      type: 'review',
      content: `wrote a review`,
      book_id: review.bookId,
      metadata: { rating: review.rating }
    });

    return data ? toAppReview(data) : null;
  },

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    updates: { rating?: number; title?: string; content?: string }
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('reviews')
      .update({
        rating: updates.rating,
        title: updates.title,
        content: updates.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId);

    if (error) {
      console.error('Error updating review:', error);
      return false;
    }

    return true;
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }

    return true;
  },

  /**
   * Like a review
   */
  async likeReview(reviewId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase.rpc('increment_review_likes', {
      review_id: reviewId
    });

    if (error) {
      // Fallback: update directly
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ likes_count: supabase.rpc('increment', { x: 1 }) })
        .eq('id', reviewId);
      
      if (updateError) {
        console.error('Error liking review:', updateError);
        return false;
      }
    }

    return true;
  },

  /**
   * Get pending reviews (for moderation)
   */
  async getPendingReviews(): Promise<Review[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending reviews:', error);
      return [];
    }

    return (data || []).map(toAppReview);
  },

  /**
   * Moderate a review (approve/reject)
   */
  async moderateReview(reviewId: string, status: 'approved' | 'rejected'): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);

    if (error) {
      console.error('Error moderating review:', error);
      return false;
    }

    return true;
  },
};

