/**
 * Affiliate Link Utilities
 * 
 * Generates trackable affiliate links for book purchases.
 * Supports multiple providers with configurable tracking IDs.
 */

import { AFFILIATE_CONFIG } from './constants';
import { Book } from '../types';
import { trackEvent } from './analytics';

export type AffiliateProvider = 'amazon' | 'bookshop' | 'bol';

interface AffiliateLink {
  provider: AffiliateProvider;
  url: string;
  label: string;
}

/**
 * Check if affiliate links are enabled
 */
export const isAffiliateEnabled = (): boolean => {
  return AFFILIATE_CONFIG.enabled;
};

/**
 * Generate an affiliate link for a book
 */
export const generateAffiliateLink = (
  book: Book,
  provider: AffiliateProvider
): string => {
  const encodedTitle = encodeURIComponent(book.title);
  const encodedAuthor = encodeURIComponent(book.author);
  const searchQuery = `${encodedTitle}+${encodedAuthor}`;
  
  // If book has pre-defined affiliate links, use those
  if (book.affiliateLinks) {
    if (provider === 'amazon' && book.affiliateLinks.amazon) {
      return book.affiliateLinks.amazon;
    }
    if (provider === 'bookshop' && book.affiliateLinks.bookshop) {
      return book.affiliateLinks.bookshop;
    }
  }
  
  // If book has ISBN, use it for more accurate links
  const isbnParam = book.isbn ? `&isbn=${book.isbn}` : '';
  
  switch (provider) {
    case 'amazon':
      const amazonTag = AFFILIATE_CONFIG.trackingId || '';
      return `https://www.amazon.com/s?k=${searchQuery}${amazonTag ? `&tag=${amazonTag}` : ''}${isbnParam}`;
    
    case 'bookshop':
      return `https://bookshop.org/search?keywords=${searchQuery}`;
    
    case 'bol':
      return `https://www.bol.com/nl/nl/s/?searchtext=${searchQuery}`;
    
    default:
      return `https://www.amazon.com/s?k=${searchQuery}`;
  }
};

/**
 * Get all affiliate links for a book
 */
export const getAffiliateLinks = (book: Book): AffiliateLink[] => {
  const links: AffiliateLink[] = [
    {
      provider: 'amazon',
      url: generateAffiliateLink(book, 'amazon'),
      label: 'Amazon',
    },
    {
      provider: 'bookshop',
      url: generateAffiliateLink(book, 'bookshop'),
      label: 'Bookshop',
    },
    {
      provider: 'bol',
      url: generateAffiliateLink(book, 'bol'),
      label: 'Bol.com',
    },
  ];
  
  return links;
};

/**
 * Track affiliate link click
 */
export const trackAffiliateClick = (
  book: Book,
  provider: AffiliateProvider
): void => {
  trackEvent('page_view', {
    action: 'affiliate_click',
    provider,
    book_title: book.title,
    book_author: book.author,
  });
};

/**
 * Get primary purchase URL for a book
 * Uses custom purchaseUrl if available, otherwise generates one
 */
export const getPrimaryPurchaseUrl = (book: Book): string => {
  if (book.purchaseUrl) {
    return book.purchaseUrl;
  }
  
  // Default to Bookshop (indie-friendly) or Amazon
  const preferredProvider = AFFILIATE_CONFIG.provider as AffiliateProvider || 'bookshop';
  return generateAffiliateLink(book, preferredProvider);
};

