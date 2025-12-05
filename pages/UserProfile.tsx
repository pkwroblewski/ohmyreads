import React, { useState } from 'react';
import { UserProfile as UserProfileType, Book, User, ViewState } from '../types';
import { BookCard } from '../components/BookCard';
import { 
  BookOpen, Calendar, MapPin, Link as LinkIcon, 
  Settings, UserPlus, UserCheck, Share2, MoreHorizontal,
  Trophy, Flame, Star, Heart, MessageSquare, Grid, List
} from 'lucide-react';

interface UserProfileProps {
  profileUser: UserProfileType | null;
  currentUser: User | null;
  onBookClick: (book: Book) => void;
  onNavigate: (view: ViewState) => void;
}

// Mock profile data
const MOCK_PROFILE: UserProfileType = {
  id: 'profile-1',
  userId: 'u1',
  username: 'alice_reader',
  displayName: 'Alice Reader',
  bio: 'Bookworm extraordinaire 📚 | Fantasy & Sci-Fi lover | Currently exploring cozy mysteries | "So many books, so little time"',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop',
  joinDate: '2023-06-15',
  isPublic: true,
  stats: {
    booksRead: 127,
    pagesRead: 38456,
    reviewsWritten: 45,
    followers: 234,
    following: 89,
  },
  favoriteGenres: ['Fantasy', 'Science Fiction', 'Mystery'],
  currentlyReading: {
    id: 'b1',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-M.jpg',
    pageCount: 662,
  },
  readerType: 'Night Owl Reader',
};

const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'Project Hail Mary', author: 'Andy Weir', coverUrl: 'https://covers.openlibrary.org/b/id/10389354-M.jpg', rating: 5 },
  { id: '2', title: 'The Midnight Library', author: 'Matt Haig', coverUrl: 'https://covers.openlibrary.org/b/id/10547347-M.jpg', rating: 4 },
  { id: '3', title: 'Piranesi', author: 'Susanna Clarke', coverUrl: 'https://covers.openlibrary.org/b/id/10523456-M.jpg', rating: 5 },
  { id: '4', title: 'Circe', author: 'Madeline Miller', coverUrl: 'https://covers.openlibrary.org/b/id/8406786-M.jpg', rating: 4 },
];

const ACHIEVEMENTS = [
  { id: '1', name: 'Bookworm', description: 'Read 100 books', icon: <BookOpen size={20} />, earned: true },
  { id: '2', name: 'Speed Demon', description: 'Finish a book in one day', icon: <Flame size={20} />, earned: true },
  { id: '3', name: 'Reviewer', description: 'Write 50 reviews', icon: <Star size={20} />, earned: false },
  { id: '4', name: 'Social Butterfly', description: 'Follow 100 readers', icon: <Heart size={20} />, earned: true },
];

export const UserProfilePage: React.FC<UserProfileProps> = ({ 
  profileUser, 
  currentUser, 
  onBookClick,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'reviews' | 'groups'>('books');
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use mock profile if none provided
  const profile = profileUser || MOCK_PROFILE;
  const isOwnProfile = currentUser?.id === profile.userId;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 relative -mx-6 md:-mx-12 -mt-6">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative -mt-16 md:-mt-20 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white dark:border-stone-900 bg-white dark:bg-stone-800 shadow-xl"
            />
            {profile.readerType && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg">
                {profile.readerType}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-ink dark:text-stone-100">
                  {profile.displayName}
                </h1>
                <p className="text-stone-500 dark:text-stone-400">@{profile.username}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-medium text-ink dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                    <Settings size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                        isFollowing
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          : 'bg-ink dark:bg-accent text-white'
                      }`}
                    >
                      {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="p-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                      <Share2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
          {profile.bio}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            Joined {formatDate(profile.joinDate)}
          </span>
          {profile.favoriteGenres.length > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              Loves {profile.favoriteGenres.slice(0, 2).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Books Read', value: profile.stats.booksRead },
          { label: 'Pages Read', value: profile.stats.pagesRead.toLocaleString() },
          { label: 'Reviews', value: profile.stats.reviewsWritten },
          { label: 'Followers', value: profile.stats.followers },
          { label: 'Following', value: profile.stats.following },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-100 dark:border-stone-800 text-center"
          >
            <div className="text-2xl font-bold text-ink dark:text-stone-100">{stat.value}</div>
            <div className="text-sm text-stone-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Currently Reading */}
      {profile.currentlyReading && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-8 border border-amber-100 dark:border-amber-900/30">
          <h3 className="text-sm font-bold text-accent uppercase tracking-wide mb-4">Currently Reading</h3>
          <div className="flex gap-4">
            <img
              src={profile.currentlyReading.coverUrl}
              alt={profile.currentlyReading.title}
              className="w-16 h-24 rounded-lg object-cover shadow-md"
            />
            <div>
              <h4 className="font-bold text-ink dark:text-stone-100">{profile.currentlyReading.title}</h4>
              <p className="text-stone-600 dark:text-stone-400 text-sm">by {profile.currentlyReading.author}</p>
              <div className="mt-2 w-32 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-ink dark:text-stone-100 mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-accent" />
          Achievements
        </h3>
        <div className="flex flex-wrap gap-3">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                achievement.earned
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400'
              }`}
              title={achievement.description}
            >
              {achievement.icon}
              <span className="font-medium text-sm">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 mb-6">
        <div className="flex gap-1">
          {[
            { id: 'books', label: 'Bookshelf', icon: <BookOpen size={18} /> },
            { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18} /> },
            { id: 'groups', label: 'Groups', icon: <Heart size={18} /> },
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
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-stone-100 dark:bg-stone-800' : ''}`}
          >
            <Grid size={18} className="text-stone-500" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-stone-100 dark:bg-stone-800' : ''}`}
          >
            <List size={18} className="text-stone-500" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_BOOKS.map((book) => (
            <BookCard key={book.id} book={book} onClick={onBookClick} />
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {MOCK_BOOKS.slice(0, 2).map((book) => (
            <div key={book.id} className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-100 dark:border-stone-800">
              <div className="flex gap-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-16 h-24 rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < (book.rating || 0) ? 'text-accent fill-accent' : 'text-stone-300'}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-ink dark:text-stone-100">{book.title}</h4>
                  <p className="text-stone-500 text-sm mt-2">
                    An absolutely captivating read! The world-building is phenomenal and the characters feel so real...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Fantasy Fanatics', 'Sci-Fi Explorers'].map((group) => (
            <div key={group} className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-100 dark:border-stone-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-ink dark:text-stone-100">{group}</h4>
                <p className="text-stone-500 text-sm">Member since 2024</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

