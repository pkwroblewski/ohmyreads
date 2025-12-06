/**
 * User Library Service - Supabase Operations
 * Handles user's personal book library (shelves, reading progress)
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Book } from '../types';
import { BooksService } from './supabaseBooks';

export type BookStatus = 'want_to_read' | 'reading' | 'finished' | 'dnf';

export interface UserBook {
  id: string;
  bookId: string;
  book?: Book;
  status: BookStatus;
  progress: number;
  startDate?: string;
  finishDate?: string;
  personalRating?: number;
  createdAt: string;
  updatedAt: string;
}

export const LibraryService = {
  /**
   * Get user's full library
   */
  async getUserLibrary(userId: string): Promise<UserBook[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('user_books')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching library:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      bookId: item.book_id,
      book: item.books ? {
        id: item.books.id,
        title: item.books.title,
        author: item.books.author,
        coverUrl: item.books.cover_url,
        description: item.books.description,
        rating: item.books.average_rating,
        pageCount: item.books.page_count,
        publishedDate: item.books.published_date,
        moods: item.books.genres,
      } : undefined,
      status: item.status,
      progress: item.progress,
      startDate: item.start_date,
      finishDate: item.finish_date,
      personalRating: item.personal_rating,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  /**
   * Get books by status (shelf)
   */
  async getBooksByStatus(userId: string, status: BookStatus): Promise<UserBook[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('user_books')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId)
      .eq('status', status)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching shelf:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      bookId: item.book_id,
      book: item.books ? {
        id: item.books.id,
        title: item.books.title,
        author: item.books.author,
        coverUrl: item.books.cover_url,
        description: item.books.description,
        rating: item.books.average_rating,
        pageCount: item.books.page_count,
      } : undefined,
      status: item.status,
      progress: item.progress,
      startDate: item.start_date,
      finishDate: item.finish_date,
      personalRating: item.personal_rating,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  /**
   * Get currently reading books
   */
  async getCurrentlyReading(userId: string): Promise<UserBook[]> {
    return this.getBooksByStatus(userId, 'reading');
  },

  /**
   * Add a book to user's library
   */
  async addToLibrary(
    userId: string,
    book: Book,
    status: BookStatus = 'want_to_read'
  ): Promise<UserBook | null> {
    if (!isSupabaseConfigured()) return null;

    // First, ensure the book exists in the database
    let dbBook = await BooksService.getBook(book.id);
    if (!dbBook) {
      dbBook = await BooksService.addBook(book);
    }
    if (!dbBook) return null;

    const { data, error } = await supabase
      .from('user_books')
      .insert({
        user_id: userId,
        book_id: dbBook.id,
        status,
        progress: 0,
        start_date: status === 'reading' ? new Date().toISOString().split('T')[0] : null,
      })
      .select()
      .single();

    if (error) {
      // If duplicate, just return existing
      if (error.code === '23505') {
        const existing = await this.getBookInLibrary(userId, dbBook.id);
        return existing;
      }
      console.error('Error adding to library:', error);
      return null;
    }

    // Create activity if starting to read
    if (status === 'reading') {
      await supabase.from('activity_feed').insert({
        user_id: userId,
        type: 'started_reading',
        content: `started reading`,
        book_id: dbBook.id,
      });
    }

    return data ? {
      id: data.id,
      bookId: data.book_id,
      book: dbBook,
      status: data.status,
      progress: data.progress,
      startDate: data.start_date,
      finishDate: data.finish_date,
      personalRating: data.personal_rating,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } : null;
  },

  /**
   * Get a specific book in user's library
   */
  async getBookInLibrary(userId: string, bookId: string): Promise<UserBook | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('user_books')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching book from library:', error);
      }
      return null;
    }

    return data ? {
      id: data.id,
      bookId: data.book_id,
      book: data.books ? {
        id: data.books.id,
        title: data.books.title,
        author: data.books.author,
        coverUrl: data.books.cover_url,
      } : undefined,
      status: data.status,
      progress: data.progress,
      startDate: data.start_date,
      finishDate: data.finish_date,
      personalRating: data.personal_rating,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } : null;
  },

  /**
   * Update book status
   */
  async updateStatus(
    userId: string,
    bookId: string,
    status: BookStatus
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'reading') {
      updates.start_date = new Date().toISOString().split('T')[0];
    } else if (status === 'finished') {
      updates.finish_date = new Date().toISOString().split('T')[0];
      updates.progress = 100;
    }

    const { error } = await supabase
      .from('user_books')
      .update(updates)
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error updating status:', error);
      return false;
    }

    // Create activity
    if (status === 'finished') {
      await supabase.from('activity_feed').insert({
        user_id: userId,
        type: 'finished_book',
        content: `finished reading`,
        book_id: bookId,
      });
    } else if (status === 'reading') {
      await supabase.from('activity_feed').insert({
        user_id: userId,
        type: 'started_reading',
        content: `started reading`,
        book_id: bookId,
      });
    }

    return true;
  },

  /**
   * Update reading progress
   */
  async updateProgress(
    userId: string,
    bookId: string,
    progress: number
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const updates: any = {
      progress: Math.min(100, Math.max(0, progress)),
      updated_at: new Date().toISOString(),
    };

    // Auto-finish if 100%
    if (progress >= 100) {
      updates.status = 'finished';
      updates.finish_date = new Date().toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('user_books')
      .update(updates)
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error updating progress:', error);
      return false;
    }

    return true;
  },

  /**
   * Update personal rating
   */
  async updateRating(
    userId: string,
    bookId: string,
    rating: number
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('user_books')
      .update({
        personal_rating: rating,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error updating rating:', error);
      return false;
    }

    return true;
  },

  /**
   * Remove book from library
   */
  async removeFromLibrary(userId: string, bookId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error removing from library:', error);
      return false;
    }

    return true;
  },

  /**
   * Get library statistics
   */
  async getStats(userId: string): Promise<{
    totalBooks: number;
    reading: number;
    finished: number;
    wantToRead: number;
  }> {
    if (!isSupabaseConfigured()) {
      return { totalBooks: 0, reading: 0, finished: 0, wantToRead: 0 };
    }

    const { data, error } = await supabase
      .from('user_books')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching stats:', error);
      return { totalBooks: 0, reading: 0, finished: 0, wantToRead: 0 };
    }

    const books = data || [];
    return {
      totalBooks: books.length,
      reading: books.filter(b => b.status === 'reading').length,
      finished: books.filter(b => b.status === 'finished').length,
      wantToRead: books.filter(b => b.status === 'want_to_read').length,
    };
  },
};

