import React, { useState } from 'react';
import { ReadingGroup, User } from '../types';
import { 
  Users, Plus, Search, BookOpen, Calendar, Lock, Globe,
  MessageSquare, Crown, ArrowRight, Sparkles, Filter
} from 'lucide-react';

interface GroupsProps {
  currentUser: User | null;
  onSignIn: () => void;
}

// Mock data
const MOCK_GROUPS: ReadingGroup[] = [
  {
    id: '1',
    name: 'Fantasy Fanatics',
    description: 'For lovers of epic fantasy, magical worlds, and legendary quests. We read one fantasy book per month and discuss it together.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=200&fit=crop',
    createdBy: 'Alice',
    createdAt: '2024-01-15',
    memberCount: 1247,
    isPublic: true,
    tags: ['Fantasy', 'Epic', 'Magic'],
    currentBook: { id: 'b1', title: 'The Name of the Wind', author: 'Patrick Rothfuss' },
  },
  {
    id: '2',
    name: 'Mystery Mavens',
    description: 'Solving fictional crimes one chapter at a time. Cozy mysteries, thrillers, and detective fiction welcome!',
    coverImage: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=400&h=200&fit=crop',
    createdBy: 'Bob',
    createdAt: '2024-02-20',
    memberCount: 892,
    isPublic: true,
    tags: ['Mystery', 'Thriller', 'Crime'],
    currentBook: { id: 'b2', title: 'The Silent Patient', author: 'Alex Michaelides' },
  },
  {
    id: '3',
    name: 'Sci-Fi Explorers',
    description: 'Exploring the frontiers of science fiction. From hard sci-fi to space opera, we read it all.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    createdBy: 'Carol',
    createdAt: '2024-03-10',
    memberCount: 634,
    isPublic: true,
    tags: ['Sci-Fi', 'Space', 'Future'],
  },
  {
    id: '4',
    name: 'Romance Readers',
    description: 'Contemporary, historical, paranormal - if it has a happily ever after, we\'re reading it!',
    coverImage: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=200&fit=crop',
    createdBy: 'Diana',
    createdAt: '2024-01-05',
    memberCount: 2103,
    isPublic: true,
    tags: ['Romance', 'Contemporary', 'HEA'],
  },
  {
    id: '5',
    name: 'Classics Club',
    description: 'Reading timeless literature together. One classic per month with deep discussions.',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    createdBy: 'Edward',
    createdAt: '2024-04-01',
    memberCount: 456,
    isPublic: true,
    tags: ['Classics', 'Literature', 'Discussion'],
    currentBook: { id: 'b3', title: 'Jane Eyre', author: 'Charlotte Brontë' },
  },
  {
    id: '6',
    name: 'Speed Readers Unite',
    description: 'For those who devour books quickly. 2-3 books per month, fast-paced discussions.',
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=200&fit=crop',
    createdBy: 'Frank',
    createdAt: '2024-05-15',
    memberCount: 321,
    isPublic: false,
    tags: ['Speed Reading', 'Challenge', 'Active'],
  },
];

const POPULAR_TAGS = ['Fantasy', 'Mystery', 'Romance', 'Sci-Fi', 'Classics', 'Non-Fiction', 'Horror', 'YA'];

export const Groups: React.FC<GroupsProps> = ({ currentUser, onSignIn }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredGroups = MOCK_GROUPS.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || group.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink dark:text-stone-100 mb-4">
          Reading Groups
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
          Join a community of readers who share your interests. Read together, discuss, 
          and discover new books with like-minded bibliophiles.
        </p>
      </header>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:border-accent outline-none text-ink dark:text-white"
          />
        </div>
        <button
          onClick={() => currentUser ? setShowCreateModal(true) : onSignIn()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink dark:bg-accent text-white rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-amber-600 transition-all shrink-0"
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedTag
              ? 'bg-ink dark:bg-accent text-white'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          All Groups
        </button>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTag === tag
                ? 'bg-ink dark:bg-accent text-white'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-accent'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <article
            key={group.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden hover:shadow-xl transition-all group"
          >
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-amber-400 to-orange-500 relative overflow-hidden">
              {group.coverImage && (
                <img
                  src={group.coverImage}
                  alt={group.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute top-3 right-3">
                {group.isPublic ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-stone-700">
                    <Globe size={12} /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-900/90 rounded-full text-xs font-medium text-white">
                    <Lock size={12} /> Private
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-ink dark:text-stone-100 mb-2">{group.name}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-4 line-clamp-2">
                {group.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-accent text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Currently Reading */}
              {group.currentBook && (
                <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg mb-4">
                  <BookOpen size={16} className="text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Currently Reading</p>
                    <p className="text-sm font-medium text-ink dark:text-stone-100 truncate">
                      {group.currentBook.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats & Join */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-500">
                  <Users size={16} />
                  <span className="text-sm">{group.memberCount.toLocaleString()} members</span>
                </div>
                <button className="inline-flex items-center gap-1 px-4 py-2 bg-ink dark:bg-stone-700 text-white rounded-lg text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-600 transition-colors">
                  Join <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
          <h3 className="font-bold text-ink dark:text-stone-100 mb-2">No groups found</h3>
          <p className="text-stone-500">Try adjusting your search or create a new group!</p>
        </div>
      )}

      {/* Buddy Reads CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full" />
          <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            New Feature
          </div>
          <h2 className="text-2xl font-serif font-bold mb-3">Buddy Reads</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Find a reading partner and read the same book together. Sync your progress, 
            share thoughts, and experience stories side by side.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-stone-100 transition-all">
            Find a Buddy
          </button>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 dark:bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-scale-in">
            <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100 mb-6">Create a Reading Group</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g., Cozy Mystery Club"
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="What is your group about?"
                  className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-lg font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-ink dark:bg-accent text-white rounded-lg font-bold hover:bg-stone-800 dark:hover:bg-amber-600 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

