import React from 'react';
import { Star, ThumbsUp, MessageCircle, Clock } from 'lucide-react';

interface CommunityReview {
  id: string;
  userName: string;
  userAvatar: string;
  bookTitle: string;
  bookId?: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: number;
}

interface CommunityReviewsFeedProps {
  reviews?: CommunityReview[];
  onBookClick?: (bookId: string) => void;
  maxItems?: number;
}

// Mock reviews data for initial display
const MOCK_REVIEWS: CommunityReview[] = [
  {
    id: '1',
    userName: 'Sarah Mitchell',
    userAvatar: 'https://i.pravatar.cc/150?u=sarah',
    bookTitle: 'Tomorrow, and Tomorrow, and Tomorrow',
    rating: 5,
    comment: 'Absolutely stunned by the narrative depth in this book. The way Zevin weaves the timeline is masterful. Highly recommended for anyone interested in game design or complex friendships.',
    timestamp: '2h ago',
    likes: 24
  },
  {
    id: '2',
    userName: 'Marcus Chen',
    userAvatar: 'https://i.pravatar.cc/150?u=marcus',
    bookTitle: 'Project Hail Mary',
    rating: 5,
    comment: 'Andy Weir does it again! The science is fascinating and Rocky is now one of my favorite characters in all of fiction. Could not put this down.',
    timestamp: '5h ago',
    likes: 18
  },
  {
    id: '3',
    userName: 'Elena Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?u=elena',
    bookTitle: 'The Midnight Library',
    rating: 4,
    comment: 'A beautiful exploration of life\'s what-ifs. Made me appreciate the choices that led me here. Perfect for anyone going through a transition.',
    timestamp: '1d ago',
    likes: 31
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={12}
        className={`${star <= rating ? 'text-amber-400 dark:text-yellow-500 fill-current' : 'text-stone-300 dark:text-zinc-600'}`}
      />
    ))}
  </div>
);

export const CommunityReviewsFeed: React.FC<CommunityReviewsFeedProps> = ({
  reviews = MOCK_REVIEWS,
  onBookClick,
  maxItems = 3
}) => {
  const displayReviews = reviews.slice(0, maxItems);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-serif font-bold text-ink dark:text-white tracking-tight flex items-center gap-2">
          <MessageCircle size={20} className="text-indigo-500" />
          Recent Community Reviews
        </h3>
      </div>

      <div className="space-y-4">
        {displayReviews.map((review) => (
          <div 
            key={review.id}
            className="p-4 md:p-5 bg-white dark:bg-zinc-900/30 border border-stone-200 dark:border-zinc-800/50 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex items-start gap-3 md:gap-4">
              {/* Avatar */}
              <img 
                src={review.userAvatar} 
                alt={review.userName}
                className="w-10 h-10 rounded-full border border-stone-200 dark:border-zinc-700 object-cover shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-ink dark:text-white truncate">{review.userName}</h4>
                  <span className="text-xs text-stone-400 dark:text-zinc-500 flex items-center gap-1 shrink-0 ml-2">
                    <Clock size={10} />
                    {review.timestamp}
                  </span>
                </div>
                
                {/* Book & Rating */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs text-stone-500 dark:text-zinc-400">reviewed</span>
                  <button 
                    onClick={() => review.bookId && onBookClick?.(review.bookId)}
                    className="text-xs font-medium text-accent dark:text-indigo-400 hover:underline truncate max-w-[200px]"
                  >
                    {review.bookTitle}
                  </button>
                  <StarRating rating={review.rating} />
                </div>
                
                {/* Comment */}
                <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-3">
                  {review.comment}
                </p>
                
                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-zinc-500 hover:text-ink dark:hover:text-white transition-colors">
                    <ThumbsUp size={14} />
                    {review.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-zinc-500 hover:text-ink dark:hover:text-white transition-colors">
                    <MessageCircle size={14} />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Link */}
      {reviews.length > maxItems && (
        <button className="w-full mt-4 py-3 text-sm font-medium text-stone-500 dark:text-zinc-500 hover:text-ink dark:hover:text-white border border-dashed border-stone-300 dark:border-zinc-700 rounded-lg hover:border-stone-400 dark:hover:border-zinc-500 transition-colors">
          View all reviews
        </button>
      )}
    </section>
  );
};

