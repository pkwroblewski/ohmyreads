/**
 * Database Interface - Abstraction Layer
 * 
 * This file provides a unified interface for data operations.
 * Currently uses localStorage, but designed for easy Supabase migration.
 * 
 * To migrate to Supabase:
 * 1. Install @supabase/supabase-js
 * 2. Create lib/supabase.ts with client initialization
 * 3. Replace localStorage calls with Supabase queries
 */

// Storage keys
export const STORAGE_KEYS = {
  REVIEWS: 'ohmyreads_reviews',
  CURRENT_READ: 'ohmyreads_current_read',
  LIBRARY: 'ohmyreads_library',
  BLOG: 'ohmyreads_blog',
  USER_PREFERENCES: 'ohmyreads_preferences',
  CURRENT_USER: 'ohmyreads_current_user',
  READING_GOALS: 'ohmyreads_reading_goals',
  READING_HISTORY: 'ohmyreads_reading_history',
  AI_CHAT_HISTORY: 'ohmyreads_ai_chat',
} as const;

// Generic storage operations (localStorage for now, Supabase later)
export const db = {
  /**
   * Get data from storage
   */
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set data in storage
   */
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  /**
   * Remove data from storage
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Clear all app data
   */
  clear: (): void => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

/**
 * Generate a unique ID
 * Compatible with Supabase UUID format expectations
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
};

/**
 * Get current ISO timestamp
 */
export const getTimestamp = (): string => {
  return new Date().toISOString();
};

