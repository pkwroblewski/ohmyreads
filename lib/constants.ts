/**
 * App Constants & Configuration
 * Centralized configuration for easy management
 */

export const APP_CONFIG = {
  name: 'OhMyReads',
  tagline: 'AI Book Tracker & Reading Companion',
  url: import.meta.env.VITE_APP_URL || 'https://ohmyreads.app',
  description: 'Discover your next favorite book with OhMyReads. Features AI-powered recommendations, a personal reading tracker, and detailed analytics.',
  keywords: 'book tracker, reading log, AI book recommendations, personal library, reading statistics, book reviews, reading goals, book discovery app',
  author: 'OhMyReads Team',
} as const;

export const API_ENDPOINTS = {
  OPEN_LIBRARY: 'https://openlibrary.org',
  OPEN_LIBRARY_COVERS: 'https://covers.openlibrary.org',
} as const;

// Recommendation source: 'open-library' | 'gemini'
export type RecommendationSource = 'open-library' | 'gemini';

export const FEATURE_FLAGS = {
  enableAds: import.meta.env.VITE_ENABLE_ADS === 'true',
  enablePremium: import.meta.env.VITE_ENABLE_PREMIUM === 'true',
  enableAnalytics: !!import.meta.env.VITE_GA_TRACKING_ID,
  recommendationSource: (import.meta.env.VITE_RECO_SOURCE as RecommendationSource) || 'open-library',
  enableGeminiAI: import.meta.env.VITE_ENABLE_GEMINI === 'true',
} as const;

// Ad configuration for future ad provider integration
export const AD_CONFIG = {
  provider: import.meta.env.VITE_AD_PROVIDER || '', // 'adsense', 'carbon', etc.
  slots: {
    sidebar: import.meta.env.VITE_AD_SLOT_SIDEBAR || '',
    banner: import.meta.env.VITE_AD_SLOT_BANNER || '',
    inline: import.meta.env.VITE_AD_SLOT_INLINE || '',
    footer: import.meta.env.VITE_AD_SLOT_FOOTER || '',
  },
} as const;

// Affiliate configuration for book purchase links
export const AFFILIATE_CONFIG = {
  enabled: import.meta.env.VITE_AFFILIATE_ENABLED === 'true',
  provider: import.meta.env.VITE_AFFILIATE_PROVIDER || 'bookshop', // 'bookshop', 'amazon'
  baseUrl: import.meta.env.VITE_AFFILIATE_BASE_URL || 'https://bookshop.org/a/',
  trackingId: import.meta.env.VITE_AFFILIATE_TRACKING_ID || '',
} as const;

export const READING_GOALS = {
  defaultPagesPerDay: 30,
  defaultBooksPerYear: 12,
  streakResetHours: 36, // Hours without reading before streak resets
} as const;

export const UI_CONFIG = {
  toastDuration: 4000,
  animationDuration: 300,
  maxSearchResults: 12,
  booksPerPage: 8,
  maxFreeBooks: 50, // Limit for free users
} as const;

// Feature access levels for freemium model
export const FEATURE_ACCESS = {
  free: {
    maxManualBooks: 50,
    basicAnalytics: true,
    advancedAnalytics: false,
    aiRecommendations: false,
    unlimitedGoals: false,
    exportData: false,
  },
  premium: {
    maxManualBooks: Infinity,
    basicAnalytics: true,
    advancedAnalytics: true,
    aiRecommendations: true,
    unlimitedGoals: true,
    exportData: true,
  },
} as const;

// Social links for footer/about
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/ohmyreads',
  github: 'https://github.com/ohmyreads',
} as const;

// ViewState to URL path mapping (for future router migration)
export const VIEW_PATHS: Record<string, string> = {
  LANDING: '/',
  MY_SHELF: '/my-shelf',
  DISCOVERY: '/discovery',
  GENRES: '/genres',
  ANALYTICS: '/analytics',
  COMMUNITY: '/community',
  GROUPS: '/groups',
  USER_PROFILE: '/profile',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  ADMIN: '/admin',
  BLOG: '/blog',
  NOT_FOUND: '/404',
} as const;

