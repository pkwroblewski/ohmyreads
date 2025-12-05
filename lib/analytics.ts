/**
 * Analytics Service
 * 
 * Comprehensive analytics integration for OhMyReads.
 * Supports Google Analytics 4, Plausible, or custom solutions.
 * 
 * To enable:
 * 1. Set VITE_GA_TRACKING_ID in .env for Google Analytics
 * 2. Or set VITE_PLAUSIBLE_DOMAIN for privacy-focused analytics
 */

import { FEATURE_FLAGS } from './constants';

// Comprehensive event types for the app
type EventName = 
  // User events
  | 'sign_in'
  | 'sign_out'
  | 'profile_view'
  // Book events
  | 'book_search'
  | 'book_view'
  | 'book_added'
  | 'book_started'
  | 'book_completed'
  | 'book_progress_updated'
  // Social events
  | 'review_submitted'
  | 'group_joined'
  | 'activity_shared'
  // AI/Feature events
  | 'ai_librarian_opened'
  | 'ai_recommendation_clicked'
  | 'concierge_message_sent'
  // Monetization events
  | 'upgrade_click'
  | 'ad_impression'
  | 'ad_click'
  | 'affiliate_click'
  // Goals & engagement
  | 'goal_set'
  | 'goal_achieved'
  | 'streak_updated'
  // Generic
  | 'page_view';

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

// Check if analytics should be active
const isAnalyticsEnabled = (): boolean => {
  return FEATURE_FLAGS.enableAnalytics || import.meta.env.DEV;
};

/**
 * Track a page view
 */
export const trackPageView = (path: string): void => {
  if (!isAnalyticsEnabled()) return;
  
  const gaId = import.meta.env.VITE_GA_TRACKING_ID;
  
  if (gaId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', gaId, {
      page_path: path,
    });
  }
  
  // Plausible support
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (plausibleDomain && typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('pageview');
  }
  
  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics] Page View:', path);
  }
};

/**
 * Track a custom event
 */
export const trackEvent = (name: EventName, data?: EventData): void => {
  if (!isAnalyticsEnabled()) return;
  
  const gaId = import.meta.env.VITE_GA_TRACKING_ID;
  
  if (gaId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, data);
  }
  
  // Plausible support
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (plausibleDomain && typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(name, { props: data });
  }
  
  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics] Event:', name, data);
  }
};

/**
 * Track book-related events
 */
export const trackBookEvent = (
  action: 'search' | 'view' | 'add' | 'start' | 'complete' | 'progress',
  bookTitle?: string,
  additionalData?: EventData
): void => {
  const eventMap: Record<string, EventName> = {
    search: 'book_search',
    view: 'book_view',
    add: 'book_added',
    start: 'book_started',
    complete: 'book_completed',
    progress: 'book_progress_updated',
  };
  
  trackEvent(eventMap[action] || 'book_search', { 
    book_title: bookTitle,
    ...additionalData 
  });
};

/**
 * Track AI Librarian usage
 */
export const trackAIUsage = (
  action: 'opened' | 'message_sent' | 'recommendation_clicked',
  data?: EventData
): void => {
  const eventMap: Record<string, EventName> = {
    opened: 'ai_librarian_opened',
    message_sent: 'concierge_message_sent',
    recommendation_clicked: 'ai_recommendation_clicked',
  };
  
  trackEvent(eventMap[action], data);
};

/**
 * Track monetization events
 */
export const trackMonetization = (
  action: 'upgrade_click' | 'ad_impression' | 'ad_click' | 'affiliate_click',
  data?: EventData
): void => {
  trackEvent(action, data);
};

/**
 * Track goal-related events
 */
export const trackGoalEvent = (
  action: 'set' | 'achieved' | 'streak_updated',
  data?: EventData
): void => {
  const eventMap: Record<string, EventName> = {
    set: 'goal_set',
    achieved: 'goal_achieved',
    streak_updated: 'streak_updated',
  };
  
  trackEvent(eventMap[action], data);
};

/**
 * Initialize analytics (call in App.tsx on mount)
 * Loads analytics scripts dynamically if configured
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;
  
  const gaId = import.meta.env.VITE_GA_TRACKING_ID;
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  
  // Initialize Google Analytics 4
  if (gaId && !(window as any).gtag) {
    // Create dataLayer if it doesn't exist
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', gaId);
    
    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    
    console.log('[Analytics] Google Analytics initialized:', gaId);
  }
  
  // Initialize Plausible
  if (plausibleDomain && !(window as any).plausible) {
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.setAttribute('data-domain', plausibleDomain);
    script.src = 'https://plausible.io/js/plausible.js';
    document.head.appendChild(script);
    
    console.log('[Analytics] Plausible initialized:', plausibleDomain);
  }
  
  // Development mode logging
  if (import.meta.env.DEV && !gaId && !plausibleDomain) {
    console.log('[Analytics] Running in development mode - events will be logged to console');
  }
};
