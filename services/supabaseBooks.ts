/**
 * Books Service - Supabase Operations
 * Handles all book-related database operations
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Book as DbBook } from '../types/database';
import type { Book } from '../types';

// Convert database book to app book format
const toAppBook = (dbBook: DbBook): Book => ({
  id: dbBook.id,
  title: dbBook.title,
  author: dbBook.author,
  coverUrl: dbBook.cover_url || undefined,
  description: dbBook.description || undefined,
  rating: dbBook.average_rating || undefined,
  pageCount: dbBook.page_count || undefined,
  publishedDate: dbBook.published_date || undefined,
  moods: dbBook.genres || undefined,
  isbn: dbBook.isbn || undefined,
});

// Convert app book to database format
const toDbBook = (book: Partial<Book>): Partial<DbBook> => ({
  title: book.title!,
  author: book.author!,
  cover_url: book.coverUrl,
  description: book.description,
  isbn: book.isbn,
  page_count: book.pageCount,
  published_date: book.publishedDate,
  genres: book.moods,
});

export const BooksService = {
  /**
   * Get all books with optional filters
   */
  async getBooks(options?: {
    search?: string;
    genre?: string;
    limit?: number;
    offset?: number;
  }): Promise<Book[]> {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,author.ilike.%${options.search}%`);
    }

    if (options?.genre) {
      query = query.contains('genres', [options.genre]);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching books:', error);
      return [];
    }

    return (data || []).map(toAppBook);
  },

  /**
   * Get a single book by ID
   */
  async getBook(id: string): Promise<Book | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching book:', error);
      return null;
    }

    return data ? toAppBook(data) : null;
  },

  /**
   * Get a book by ISBN
   */
  async getBookByIsbn(isbn: string): Promise<Book | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('isbn', isbn)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching book by ISBN:', error);
    }

    return data ? toAppBook(data) : null;
  },

  /**
   * Add a new book to the database
   */
  async addBook(book: Partial<Book>): Promise<Book | null> {
    if (!isSupabaseConfigured()) return null;

    // Check if book with same ISBN already exists
    if (book.isbn) {
      const existing = await this.getBookByIsbn(book.isbn);
      if (existing) return existing;
    }

    const { data, error } = await supabase
      .from('books')
      .insert(toDbBook(book))
      .select()
      .single();

    if (error) {
      console.error('Error adding book:', error);
      return null;
    }

    return data ? toAppBook(data) : null;
  },

  /**
   * Search books (full-text search)
   */
  async searchBooks(query: string, limit = 10): Promise<Book[]> {
    if (!isSupabaseConfigured() || !query.trim()) return [];

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching books:', error);
      return [];
    }

    return (data || []).map(toAppBook);
  },

  /**
   * Get popular books (by review count)
   */
  async getPopularBooks(limit = 10): Promise<Book[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('review_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular books:', error);
      return [];
    }

    return (data || []).map(toAppBook);
  },

  /**
   * Get top-rated books
   */
  async getTopRatedBooks(limit = 10): Promise<Book[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .not('average_rating', 'is', null)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top-rated books:', error);
      return [];
    }

    return (data || []).map(toAppBook);
  },
};

