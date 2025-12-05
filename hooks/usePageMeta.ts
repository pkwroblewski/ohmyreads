/**
 * usePageMeta Hook
 * 
 * Updates document title and meta tags for SPA navigation.
 * Helps with browser history, tab titles, and basic SEO for SPAs.
 * 
 * Note: For full SEO, consider SSR/SSG with Next.js in the future.
 */

import { useEffect } from 'react';
import { APP_CONFIG } from '../lib/constants';

interface PageMetaOptions {
  title?: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
}

/**
 * Update page meta tags
 */
export const usePageMeta = (options: PageMetaOptions = {}): void => {
  useEffect(() => {
    const {
      title,
      description = APP_CONFIG.description,
      keywords = APP_CONFIG.keywords,
      noIndex = false,
    } = options;

    // Update document title
    const fullTitle = title 
      ? `${title} | ${APP_CONFIG.name}`
      : `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`;
    
    document.title = fullTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle);
    }

    // Update Twitter description
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }

    // Handle noIndex for private pages
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    // Cleanup function to restore defaults when unmounting
    return () => {
      // Title will be updated by the next page anyway
    };
  }, [options.title, options.description, options.keywords, options.noIndex]);
};

/**
 * Pre-defined page meta configurations
 */
export const PAGE_META = {
  landing: {
    title: undefined, // Uses default
    description: 'Discover your next favorite book with OhMyReads. AI-powered book tracker, reading log, and personalized recommendations for book lovers.',
  },
  discovery: {
    title: 'Discover Books',
    description: 'Search millions of books and find your next great read. AI-powered book discovery and recommendations.',
  },
  myShelf: {
    title: 'My Shelf',
    description: 'Track your reading progress, manage your book collection, and achieve your reading goals.',
    noIndex: true, // Private page
  },
  analytics: {
    title: 'Reading Stats',
    description: 'Visualize your reading habits with detailed analytics and insights.',
    noIndex: true,
  },
  community: {
    title: 'Community',
    description: 'Connect with fellow book lovers, share reviews, and discover what others are reading.',
  },
  groups: {
    title: 'Reading Groups',
    description: 'Join book clubs and reading groups to discuss your favorite books with others.',
    noIndex: true,
  },
  genres: {
    title: 'Browse Genres',
    description: 'Explore books by genre - from fantasy and romance to mystery and sci-fi. Find your perfect read.',
  },
  blog: {
    title: 'OhMyBlog',
    description: 'Reading insights, book recommendations, and literary musings from the OhMyReads community.',
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with the OhMyReads team. We\'d love to hear from you!',
  },
  faq: {
    title: 'FAQ',
    description: 'Frequently asked questions about OhMyReads - your AI-powered book tracker and reading companion.',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Learn how OhMyReads protects your privacy and handles your data.',
  },
} as const;

export default usePageMeta;

