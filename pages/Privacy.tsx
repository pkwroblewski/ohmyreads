import React, { useState } from 'react';
import { Shield, Cookie, Eye, Database, Lock, FileText, ChevronRight } from 'lucide-react';

type PolicySection = 'privacy' | 'cookies' | 'terms';

export const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<PolicySection>('privacy');

  const sections = [
    { id: 'privacy' as PolicySection, label: 'Privacy Policy', icon: <Shield size={20} /> },
    { id: 'cookies' as PolicySection, label: 'Cookie Policy', icon: <Cookie size={20} /> },
    { id: 'terms' as PolicySection, label: 'Terms of Service', icon: <FileText size={20} /> },
  ];

  const lastUpdated = 'November 30, 2025';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          Legal & Privacy
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Last updated: {lastUpdated}
        </p>
      </header>

      {/* Section Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              activeSection === section.id
                ? 'bg-ink dark:bg-accent text-white shadow-lg'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-accent'
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        {activeSection === 'privacy' && (
          <div className="p-8 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-accent">
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">
                  Information We Collect
                </h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>
                  We collect information you provide directly to us, including:
                </p>
                <ul>
                  <li>Account information (username, email, profile picture)</li>
                  <li>Reading data (books you add, reading progress, reviews)</li>
                  <li>Communication data (messages, feedback, support requests)</li>
                  <li>Usage data (how you interact with our platform)</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                  <Database size={20} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">
                  How We Use Your Information
                </h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Personalize your experience and book recommendations</li>
                  <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">
                  Data Security
                </h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>
                  We take reasonable measures to help protect your personal information from loss, theft, 
                  misuse, unauthorized access, disclosure, alteration, and destruction. All data is 
                  encrypted in transit using TLS and at rest using AES-256 encryption.
                </p>
                <p>
                  You can request a copy of your data or request deletion at any time through your 
                  account settings or by contacting our support team.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'cookies' && (
          <div className="p-8 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-accent">
                  <Cookie size={20} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">
                  What Are Cookies?
                </h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences, 
                  keeping you logged in, and analyzing how you use our platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
                Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Essential Cookies', description: 'Required for the website to function. Cannot be disabled.', required: true },
                  { name: 'Analytics Cookies', description: 'Help us understand how visitors interact with our website.', required: false },
                  { name: 'Preference Cookies', description: 'Remember your settings like dark mode and language.', required: false },
                  { name: 'Marketing Cookies', description: 'Used to track visitors across websites for advertising purposes.', required: false },
                ].map((cookie) => (
                  <div key={cookie.name} className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-bold text-ink dark:text-stone-100">{cookie.name}</h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400">{cookie.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      cookie.required 
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}>
                      {cookie.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'terms' && (
          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
                Acceptance of Terms
              </h2>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>
                  By accessing or using OhMyReads, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access our service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
                User Accounts
              </h2>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>
                  You are responsible for maintaining the confidentiality of your account and password. 
                  You agree to accept responsibility for all activities that occur under your account.
                </p>
                <ul>
                  <li>You must be at least 13 years old to use this service</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for all content you post</li>
                  <li>You may not use the service for illegal purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
                Content Guidelines
              </h2>
              <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-400">
                <p>Users agree not to post content that:</p>
                <ul>
                  <li>Is unlawful, threatening, abusive, or defamatory</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains spam, advertisements, or promotional material</li>
                  <li>Impersonates another person or entity</li>
                  <li>Contains viruses or malicious code</li>
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Contact Note */}
      <div className="text-center text-stone-500 dark:text-stone-400 text-sm">
        <p>
          If you have any questions about our policies, please contact us at{' '}
          <a href="mailto:legal@ohmyreads.app" className="text-accent hover:underline">
            legal@ohmyreads.app
          </a>
        </p>
      </div>
    </div>
  );
};

