/**
 * Recommendation Service - Unified adapter for book discovery
 * 
 * Proxies requests to either Open Library (free) or Gemini (premium/AI-powered)
 * based on FEATURE_FLAGS configuration.
 * 
 * This abstraction allows seamless switching between data sources
 * without modifying consumer components.
 */

import { Book } from '../types';
import { FEATURE_FLAGS } from '../lib/constants';
import * as openLibrary from './openLibraryService';

// Gemini is loaded dynamically to avoid import errors when package isn't installed
const loadGemini = async () => {
  try {
    return await import('./geminiService');
  } catch (e) {
    console.warn('[Recommendations] Gemini service not available:', e);
    return null;
  }
};

export type RecommendationSourceType = 'open-library' | 'gemini';

// Get current recommendation source from config
const getSource = (): RecommendationSourceType => {
  // If Gemini is enabled and premium features are on, use Gemini for AI-powered recommendations
  if (FEATURE_FLAGS.enableGeminiAI && FEATURE_FLAGS.recommendationSource === 'gemini') {
    return 'gemini';
  }
  return 'open-library';
};

// Metadata about the current source for UI display
export const getSourceInfo = (): { name: string; isAI: boolean; badge?: string } => {
  const source = getSource();
  if (source === 'gemini') {
    return { name: 'Gemini AI', isAI: true, badge: 'AI-Curated' };
  }
  return { name: 'Open Library', isAI: false };
};

/**
 * Search for books using the configured recommendation source
 */
export const searchBooks = async (query: string): Promise<Book[]> => {
  const source = getSource();
  
  try {
    if (source === 'gemini') {
      const gemini = await loadGemini();
      if (gemini) {
        return await gemini.searchBooks(query);
      }
    }
    return await openLibrary.searchBooks(query);
  } catch (error) {
    console.error(`Search failed with ${source}, falling back to Open Library:`, error);
    // Fallback to Open Library if Gemini fails
    return await openLibrary.searchBooks(query);
  }
};

/**
 * Get curated book list (award-winning, staff picks, etc.)
 */
export const getCuratedList = async (): Promise<Book[]> => {
  const source = getSource();
  
  try {
    if (source === 'gemini') {
      const gemini = await loadGemini();
      if (gemini) {
        return await gemini.getCuratedList();
      }
    }
    return await openLibrary.getCuratedList();
  } catch (error) {
    console.error(`Curated list failed with ${source}, falling back:`, error);
    return await openLibrary.getCuratedList();
  }
};

/**
 * Get community favorites (BookTok, viral hits, book club picks)
 */
export const getCommunityFavorites = async (): Promise<Book[]> => {
  const source = getSource();
  
  try {
    if (source === 'gemini') {
      const gemini = await loadGemini();
      if (gemini) {
        return await gemini.getCommunityFavorites();
      }
    }
    return await openLibrary.getCommunityFavorites();
  } catch (error) {
    console.error(`Community favorites failed with ${source}, falling back:`, error);
    return await openLibrary.getCommunityFavorites();
  }
};

/**
 * Get real-time trending books
 */
export const getRealTimeTrends = async (): Promise<Book[]> => {
  const source = getSource();
  
  try {
    if (source === 'gemini') {
      const gemini = await loadGemini();
      if (gemini) {
        return await gemini.getRealTimeTrends();
      }
    }
    return await openLibrary.getRealTimeTrends();
  } catch (error) {
    console.error(`Trends failed with ${source}, falling back:`, error);
    return await openLibrary.getRealTimeTrends();
  }
};

/**
 * Get books by genre/category
 */
export const getBooksByGenre = async (genre: string): Promise<Book[]> => {
  // Currently only Open Library has genre browsing
  // Gemini could be extended to provide genre-specific recommendations
  return await openLibrary.getBooksByGenre(genre);
};

/**
 * Get personalized recommendations based on user's reading history
 * This is a premium feature that uses AI when available
 */
export const getPersonalizedRecommendations = async (
  favoriteGenres: string[],
  recentBooks: Book[]
): Promise<Book[]> => {
  const source = getSource();
  
  if (source === 'gemini' && FEATURE_FLAGS.enablePremium) {
    // In a full implementation, this would send the user's preferences
    // to Gemini for personalized recommendations
    try {
      const gemini = await loadGemini();
      if (gemini) {
        const genreQuery = favoriteGenres.length > 0 
          ? `Recommend books similar to ${favoriteGenres.join(', ')} genres`
          : 'Recommend popular books';
        return await gemini.searchBooks(genreQuery);
      }
    } catch (error) {
      console.error('Personalized recommendations failed:', error);
    }
  }
  
  // Fallback: return books from first favorite genre
  if (favoriteGenres.length > 0) {
    return await openLibrary.getBooksByGenre(favoriteGenres[0]);
  }
  
  return await openLibrary.getCuratedList();
};

// Re-export concierge response for AI chat (always uses Open Library for now)
export { getConciergeResponse, getSmartSuggestions, type ConciergeResponse } from './openLibraryService';

