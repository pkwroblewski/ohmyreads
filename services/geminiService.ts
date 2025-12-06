/**
 * Gemini AI Service - Secure Client
 * 
 * This service calls Supabase Edge Functions instead of using the API key directly.
 * Your Gemini API key stays secure on the server - users can't see or steal it!
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Book } from "../types";

// Supabase Edge Function URL
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-ai`;

/**
 * Call the secure Edge Function
 */
async function callGeminiFunction(action: string, payload: any = {}) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, AI features disabled');
    return null;
  }

  try {
    // Get the current session for authorization
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`Gemini ${action} failed:`, error);
    return null;
  }
}

/**
 * Searches for books using Gemini AI (server-side secure)
 */
export const searchBooks = async (query: string): Promise<Book[]> => {
  const result = await callGeminiFunction('search', { query });
  return result || [];
};

/**
 * Chat with a "Librarian" AI persona (server-side secure)
 */
export const chatWithLibrarian = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  const result = await callGeminiFunction('chat', { history, message });
  return result?.response || "I'm sorry, I couldn't process that request. Please try again.";
};

/**
 * Get curated book recommendations (server-side secure)
 */
export const getCuratedList = async (): Promise<Book[]> => {
  const result = await callGeminiFunction('curated');
  return result || [];
};

/**
 * Get community favorite books (server-side secure)
 */
export const getCommunityFavorites = async (): Promise<Book[]> => {
  const result = await callGeminiFunction('community');
  return result || [];
};

/**
 * Get real-time trending books (server-side secure)
 */
export const getRealTimeTrends = async (): Promise<Book[]> => {
  const result = await callGeminiFunction('trends');
  return result || [];
};

/**
 * Placeholder - image generation not implemented
 */
export const generateBookEssence = async (
  title: string,
  author: string,
  style: string
): Promise<string | null> => {
  return null;
};
