import React, { useState, useEffect } from 'react';
import { ViewState, User, ActivityFeedItem, UserProfile } from '../types';
import { 
  Users, BookOpen, MessageSquare, Trophy, TrendingUp, 
  Heart, Star, Clock, ArrowRight, Sparkles
} from 'lucide-react';

interface CommunityProps {
  currentUser: User | null;
  onNavigate: (view: ViewState) => void;
  onSignIn: () => void;
}

// Mock data for demonstration
const MOCK_ACTIVITY: ActivityFeedItem[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Alice Reader',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    type: 'finished_book',
    content: 'finished reading',
    bookId: 'b1',
    bookTitle: 'The Great Gatsby',
    bookCover: 'https://covers.openlibrary.org/b/id/8432047-M.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Bob Bibliophile',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    type: 'started_reading',
    content: 'started reading',
    bookId: 'b2',
    bookTitle: '1984',
    bookCover: 'https://covers.openlibrary.org/b/id/8575141-M.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Carol Chapters',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    type: 'review',
    content: 'reviewed',
    bookId: 'b3',
    bookTitle: 'Pride and Prejudice',
    bookCover: 'https://covers.openlibrary.org/b/id/8479576-M.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'David Dewey',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    type: 'joined_group',
    content: 'joined the group "Fantasy Fanatics"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Emma Explorer',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    type: 'achievement',
    content: 'earned the "Bookworm" badge for reading 10 books!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

const FEATURED_MEMBERS: Partial<UserProfile>[] = [
  { id: '1', displayName: 'Alice Reader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', readerType: 'Night Owl', stats: { booksRead: 127, pagesRead: 38000, reviewsWritten: 45, followers: 234, following: 89 } },
  { id: '2', displayName: 'Bob Bibliophile', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', readerType: 'Speed Reader', stats: { booksRead: 89, pagesRead: 28000, reviewsWritten: 32, followers: 156, following: 67 } },
  { id: '3', displayName: 'Carol Chapters', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol', readerType: 'Genre Explorer', stats: { booksRead: 156, pagesRead: 52000, reviewsWritten: 78, followers: 345, following: 112 } },
];

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const Community: React.FC<CommunityProps> = ({ currentUser, onNavigate, onSignIn }) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'members' | 'discussions'>('activity');

  const stats = [
    { label: 'Active Readers', value: '12,847', icon: <Users size={20} /> },
    { label: 'Books Tracked', value: '284K', icon: <BookOpen size={20} /> },
    { label: 'Reviews Written', value: '45K', icon: <MessageSquare size={20} /> },
    { label: 'Reading Groups', value: '1,234', icon: <Trophy size={20} /> },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero Section */}
      <header className="text-center relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-200 to-amber-200 dark:from-purple-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-sm font-medium text-accent mb-6 shadow-sm">
            <Sparkles size={16} />
            Join {stats[0].value} readers
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
            OhMyReads Community
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Connect with fellow book lovers, share your reading journey, join discussion groups, 
            and discover what the community is reading.
          </p>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-100 dark:border-stone-800 text-center">
            <div className="w-10 h-10 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-accent mb-2">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-ink dark:text-stone-100">{stat.value}</div>
            <div className="text-sm text-stone-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-stone-200 dark:border-stone-700">
        {[
          { id: 'activity', label: 'Activity Feed', icon: <TrendingUp size={18} /> },
          { id: 'members', label: 'Featured Members', icon: <Users size={18} /> },
          { id: 'discussions', label: 'Discussions', icon: <MessageSquare size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-stone-500 hover:text-ink dark:hover:text-stone-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {MOCK_ACTIVITY.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-100 dark:border-stone-800 flex gap-4 hover:shadow-md transition-shadow"
            >
              <img
                src={item.userAvatar}
                alt={item.userName}
                className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-ink dark:text-stone-100">{item.userName}</span>
                  <span className="text-stone-500">{item.content}</span>
                  {item.bookTitle && (
                    <span className="font-medium text-accent">{item.bookTitle}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatTimeAgo(item.timestamp)}
                  </span>
                  {item.type === 'finished_book' && (
                    <span className="flex items-center gap-1 text-green-500">
                      <Trophy size={14} />
                      Completed!
                    </span>
                  )}
                </div>
              </div>
              {item.bookCover && (
                <img
                  src={item.bookCover}
                  alt={item.bookTitle}
                  className="w-12 h-16 rounded object-cover shadow-sm"
                />
              )}
            </div>
          ))}
          
          {!currentUser && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 text-center">
              <p className="text-stone-700 dark:text-stone-300 mb-4">
                Sign in to see activity from readers you follow
              </p>
              <button
                onClick={onSignIn}
                className="px-6 py-2 bg-ink dark:bg-accent text-white rounded-full font-bold hover:bg-stone-800 dark:hover:bg-amber-600 transition-all"
              >
                Sign In to Join
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-100 dark:border-stone-800 text-center hover:shadow-lg transition-shadow"
            >
              <img
                src={member.avatar}
                alt={member.displayName}
                className="w-20 h-20 rounded-full mx-auto mb-4 bg-stone-100 dark:bg-stone-800"
              />
              <h3 className="font-bold text-lg text-ink dark:text-stone-100">{member.displayName}</h3>
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-accent text-xs font-bold rounded-full mt-2">
                {member.readerType}
              </span>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <div className="font-bold text-ink dark:text-stone-100">{member.stats?.booksRead}</div>
                  <div className="text-xs text-stone-500">Books</div>
                </div>
                <div>
                  <div className="font-bold text-ink dark:text-stone-100">{member.stats?.reviewsWritten}</div>
                  <div className="text-xs text-stone-500">Reviews</div>
                </div>
                <div>
                  <div className="font-bold text-ink dark:text-stone-100">{member.stats?.followers}</div>
                  <div className="text-xs text-stone-500">Followers</div>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border border-accent text-accent rounded-lg font-medium hover:bg-accent hover:text-white transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className="space-y-4">
          {[
            { title: 'What book changed your life?', replies: 234, lastActive: '5m ago' },
            { title: 'Best fantasy series for beginners?', replies: 89, lastActive: '15m ago' },
            { title: 'Hot take: Audiobooks count as reading', replies: 567, lastActive: '1h ago' },
            { title: 'Monthly book club picks for December', replies: 45, lastActive: '2h ago' },
          ].map((discussion, index) => (
            <div
              key={index}
              className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-100 dark:border-stone-800 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <h3 className="font-bold text-ink dark:text-stone-100 mb-1">{discussion.title}</h3>
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    {discussion.replies} replies
                  </span>
                  <span>Last active {discussion.lastActive}</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-stone-400" />
            </div>
          ))}
        </div>
      )}

      {/* Groups CTA */}
      <div className="bg-ink dark:bg-stone-800 rounded-2xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:20px_20px]" />
        <div className="relative z-10">
          <h2 className="text-2xl font-serif font-bold mb-3">Join a Reading Group</h2>
          <p className="text-stone-300 mb-6 max-w-lg mx-auto">
            Find your tribe! Join reading groups based on genres, reading pace, or interests.
          </p>
          <button
            onClick={() => onNavigate(ViewState.GROUPS)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-bold hover:bg-amber-600 transition-all"
          >
            <Users size={18} />
            Explore Groups
          </button>
        </div>
      </div>
    </div>
  );
};

