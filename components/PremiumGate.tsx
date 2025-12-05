import React from 'react';
import { FEATURE_FLAGS, FEATURE_ACCESS } from '../lib/constants';
import { ExtendedUser } from '../types';
import { Crown, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

type FeatureKey = keyof typeof FEATURE_ACCESS.free;

interface PremiumGateProps {
  children: React.ReactNode;
  feature: FeatureKey;
  user: ExtendedUser | null;
  fallback?: 'blur' | 'lock' | 'banner' | 'hide';
  title?: string;
  description?: string;
  onUpgradeClick?: () => void;
}

/**
 * PremiumGate Component
 * 
 * Wraps features that require premium subscription.
 * Renders the feature if user has access, otherwise shows an upsell.
 * 
 * Usage:
 * <PremiumGate feature="advancedAnalytics" user={currentUser}>
 *   <AdvancedAnalyticsChart />
 * </PremiumGate>
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  feature,
  user,
  fallback = 'banner',
  title,
  description,
  onUpgradeClick
}) => {
  // If premium features are disabled globally, show the feature
  if (!FEATURE_FLAGS.enablePremium) {
    return <>{children}</>;
  }

  // Check if user has access to this feature
  const subscription = user?.subscription || 'free';
  const accessLevel = FEATURE_ACCESS[subscription];
  const hasAccess = accessLevel[feature];

  if (hasAccess) {
    return <>{children}</>;
  }

  const handleUpgradeClick = () => {
    trackEvent('page_view', { action: 'upgrade_click', feature });
    onUpgradeClick?.();
  };

  // Render fallback based on type
  switch (fallback) {
    case 'hide':
      return null;

    case 'blur':
      return (
        <div className="relative">
          <div className="blur-sm pointer-events-none select-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-xl">
            <PremiumUpsellCard
              title={title}
              description={description}
              onUpgradeClick={handleUpgradeClick}
              variant="compact"
            />
          </div>
        </div>
      );

    case 'lock':
      return (
        <div className="relative bg-stone-50 dark:bg-stone-900 rounded-xl p-8 border border-dashed border-stone-300 dark:border-stone-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-ink dark:text-stone-100 mb-2">
              {title || 'Premium Feature'}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 max-w-md mx-auto">
              {description || 'Upgrade to Premium to unlock this feature and get the most out of OhMyReads.'}
            </p>
            <button
              onClick={handleUpgradeClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
            >
              <Crown size={18} /> Upgrade to Premium
            </button>
          </div>
        </div>
      );

    case 'banner':
    default:
      return (
        <PremiumUpsellCard
          title={title}
          description={description}
          onUpgradeClick={handleUpgradeClick}
          variant="full"
        />
      );
  }
};

interface PremiumUpsellCardProps {
  title?: string;
  description?: string;
  onUpgradeClick?: () => void;
  variant?: 'full' | 'compact';
}

const PremiumUpsellCard: React.FC<PremiumUpsellCardProps> = ({
  title,
  description,
  onUpgradeClick,
  variant = 'full'
}) => {
  if (variant === 'compact') {
    return (
      <div className="text-center p-4">
        <Crown size={24} className="mx-auto text-amber-500 mb-2" />
        <p className="text-sm font-bold text-ink dark:text-stone-100 mb-3">
          {title || 'Premium Feature'}
        </p>
        <button
          onClick={onUpgradeClick}
          className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full hover:bg-amber-600 transition-colors"
        >
          Upgrade
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="font-bold text-ink dark:text-stone-100 flex items-center gap-2">
              {title || 'Unlock Premium Features'}
              <Crown size={16} className="text-amber-500" />
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {description || 'Get unlimited books, advanced analytics, AI recommendations, and more.'}
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20 group"
        >
          Upgrade Now
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

/**
 * PremiumBanner Component
 * A simpler banner for promoting premium in non-gated contexts
 */
export const PremiumBanner: React.FC<{ onUpgradeClick?: () => void }> = ({ onUpgradeClick }) => {
  if (!FEATURE_FLAGS.enablePremium) {
    return null;
  }

  const handleClick = () => {
    trackEvent('page_view', { action: 'upgrade_click', source: 'banner' });
    onUpgradeClick?.();
  };

  return (
    <div className="bg-gradient-to-r from-accent/10 to-amber-100 dark:from-amber-900/20 dark:to-stone-800 rounded-xl p-4 border border-accent/20">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-ink dark:text-stone-100">Upgrade to Premium</h4>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Unlock unlimited books, advanced analytics, and more.
          </p>
        </div>
        <button 
          onClick={handleClick}
          className="px-4 py-2 bg-accent text-white rounded-full font-bold text-sm hover:bg-amber-600 transition-colors"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
};

