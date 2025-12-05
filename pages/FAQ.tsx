import React, { useState } from 'react';
import { ViewState } from '../types';
import { ChevronDown, HelpCircle, BookOpen, Users, Shield, CreditCard, Mail } from 'lucide-react';

interface FAQProps {
  onNavigate: (view: ViewState) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  questions: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: <BookOpen size={20} />,
    questions: [
      {
        question: 'What is OhMyReads?',
        answer: 'OhMyReads is a social reading platform that helps you track your reading progress, discover new books, connect with fellow readers, and join reading groups. Think of it as your personal reading companion that makes your literary journey more enjoyable and organized.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Creating an account is simple! Click the "Sign In" button in the top right corner, enter your preferred username, and you\'re ready to start. We offer both free and premium accounts to suit your reading needs.',
      },
      {
        question: 'Is OhMyReads free to use?',
        answer: 'Yes! OhMyReads offers a generous free tier that includes book tracking, basic statistics, and community access. Premium features like advanced analytics, unlimited shelves, and ad-free experience are available with our subscription plans.',
      },
      {
        question: 'Can I import my books from Goodreads?',
        answer: 'We\'re working on a Goodreads import feature! In the meantime, you can manually add books to your library using our quick-add feature or by searching our extensive book database.',
      },
    ],
  },
  {
    id: 'community',
    name: 'Community & Groups',
    icon: <Users size={20} />,
    questions: [
      {
        question: 'How do reading groups work?',
        answer: 'Reading groups are communities of readers who share similar interests. You can join existing groups based on genres, themes, or reading pace, or create your own group. Groups can have shared reading challenges, discussion boards, and buddy read sessions.',
      },
      {
        question: 'Can I make my profile private?',
        answer: 'Absolutely! You have full control over your privacy settings. You can make your entire profile private, or choose to hide specific shelves while keeping others public. Your reading journey is yours to share as you see fit.',
      },
      {
        question: 'How do I connect with other readers?',
        answer: 'You can follow other readers, join reading groups, participate in discussions, and comment on reviews. Our community features are designed to help you find readers with similar tastes and build meaningful connections around books.',
      },
    ],
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    icon: <Shield size={20} />,
    questions: [
      {
        question: 'How is my data protected?',
        answer: 'We take your privacy seriously. All data is encrypted in transit and at rest. We never sell your personal information to third parties. You can export or delete your data at any time from your account settings.',
      },
      {
        question: 'What information do you collect?',
        answer: 'We collect only what\'s necessary to provide our service: your account information, reading history, and interactions within the platform. We use analytics to improve the service but this data is anonymized and aggregated.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account at any time from your account settings. This will permanently remove all your data from our servers. Please note this action is irreversible.',
      },
    ],
  },
  {
    id: 'billing',
    name: 'Billing & Premium',
    icon: <CreditCard size={20} />,
    questions: [
      {
        question: 'What\'s included in Premium?',
        answer: 'Premium members enjoy advanced reading statistics, unlimited custom shelves, an ad-free experience, priority support, exclusive badges, and early access to new features. Premium helps support our platform and keeps it running.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel your subscription at any time from your account settings. You\'ll continue to have Premium access until the end of your billing period. No questions asked, no hidden fees.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 7-day money-back guarantee for new Premium subscribers. If you\'re not satisfied with Premium, contact our support team within 7 days of purchase for a full refund.',
      },
    ],
  },
];

export const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('getting-started');

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const currentCategory = FAQ_DATA.find(cat => cat.id === selectedCategory) || FAQ_DATA[0];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Header */}
      <header className="text-center">
        <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-accent mb-6">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Find answers to common questions about OhMyReads. Can't find what you're looking for? 
          Feel free to reach out to our support team.
        </p>
      </header>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {FAQ_DATA.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
              selectedCategory === category.id
                ? 'bg-ink dark:bg-accent text-white'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-accent'
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        {currentCategory.questions.map((item, index) => {
          const itemId = `${currentCategory.id}-${index}`;
          const isOpen = openItems.has(itemId);

          return (
            <div
              key={itemId}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(itemId)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <span className="font-bold text-ink dark:text-stone-100 pr-4">{item.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-stone-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-stone-600 dark:text-stone-400 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-serif font-bold text-ink dark:text-stone-100 mb-3">
          Still have questions?
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          Our support team is here to help. Reach out and we'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => onNavigate(ViewState.CONTACT)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink dark:bg-accent text-white rounded-full font-bold hover:bg-stone-800 dark:hover:bg-amber-600 transition-all"
        >
          <Mail size={18} />
          Contact Support
        </button>
      </div>
    </div>
  );
};

