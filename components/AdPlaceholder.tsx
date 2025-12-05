import React, { useEffect } from 'react';
import { isAdsEnabled, getSlotConfig, trackAdImpression, AdSlotType } from '../services/ads';

interface AdPlaceholderProps {
  slot: AdSlotType;
  className?: string;
}

/**
 * Ad Placeholder Component
 * 
 * Shows ad slots when VITE_ENABLE_ADS=true
 * Configurable for various ad providers (Google AdSense, Carbon, etc.)
 * 
 * Usage:
 * <AdPlaceholder slot="sidebar" />
 * <AdPlaceholder slot="banner" />
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  // Don't render if ads are disabled
  if (!isAdsEnabled()) {
    return null;
  }

  const config = getSlotConfig(slot);

  // Track impression when component mounts
  useEffect(() => {
    trackAdImpression(slot);
  }, [slot]);

  return (
    <div 
      className={`
        ${config.className} 
        bg-stone-100 dark:bg-stone-800 
        rounded-lg 
        flex items-center justify-center
        border border-dashed border-stone-300 dark:border-stone-600
        ${className}
      `}
      data-ad-slot={slot}
      data-ad-slot-id={config.id || 'placeholder'}
    >
      <span className="text-xs text-stone-400 uppercase tracking-wider">
        Ad Space • {slot}
      </span>
    </div>
  );
};

// Note: PremiumBanner component has been moved to components/PremiumGate.tsx
