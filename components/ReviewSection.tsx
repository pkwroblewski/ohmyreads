import React, { useState, useEffect } from 'react';
import { User, Review } from '../types';
import { ReviewService } from '../services/mockBackend';
import { Star, Trash2, ShieldCheck, Clock, Shield, AlertCircle } from 'lucide-react';

interface ReviewSectionProps {
    bookId: string;
    currentUser: User | null;
    onLoginReq: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ bookId, currentUser, onLoginReq }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Fetch reviews whenever bookId changes or user logs in/out to show their pending reviews
    useEffect(() => {
        setReviews(ReviewService.getReviewsForBookWithUserContext(bookId, currentUser?.id));
    }, [bookId, currentUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        const newReview = ReviewService.addReview({
            bookId,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            rating,
            comment
        });
        
        setComment('');
        setRating(0);
        setSubmitted(true);
        // Add new review to list immediately so user can see it
        setReviews(prev => [...prev, newReview]);
    };

    const handleDelete = (id: string) => {
        if(confirm('Are you sure you want to delete this review?')) {
            ReviewService.deleteReview(id);
            setReviews(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-6 mt-8 border-t border-stone-200 dark:border-stone-800 pt-8" itemScope itemType="https://schema.org/Book">
            <h3 className="text-xl font-serif font-bold text-ink dark:text-stone-100">Reader Reviews</h3>

            {/* Hidden Meta for Schema.org hierarchy */}
            <meta itemProp="name" content="Book Review Collection" /> 

            {/* Review List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-8 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
                        <p className="text-stone-500 dark:text-stone-400 italic">No approved reviews yet.</p>
                        <p className="text-xs text-stone-400 mt-1">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div 
                            key={review.id} 
                            className={`p-5 rounded-xl border transition-all duration-200 group relative
                                ${review.status === 'pending' 
                                    ? 'bg-amber-50/40 dark:bg-amber-900/10 border-amber-300/50 dark:border-amber-800 border-dashed' 
                                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm'
                                }
                            `}
                            itemProp="review"
                            itemScope 
                            itemType="https://schema.org/Review"
                        >
                            {review.status === 'pending' && (
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-700/50 shadow-sm">
                                        <Clock size={12} strokeWidth={2.5} /> Pending Approval
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-600 object-cover" />
                                    <div>
                                        <p className="font-bold text-sm text-ink dark:text-stone-100 leading-tight" itemProp="author" itemScope itemType="https://schema.org/Person">
                                            <span itemProp="name">{review.userName}</span>
                                        </p>
                                        <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                                            <time itemProp="datePublished" dateTime={review.date}>
                                                {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </time>
                                            {review.status === 'pending' && <span className="text-amber-500">• Under Review</span>}
                                        </p>
                                    </div>
                                </div>
                                
                                {review.status !== 'pending' && (
                                    <div className="flex items-center bg-white dark:bg-stone-900 px-2 py-1 rounded-full border border-stone-100 dark:border-stone-700 shadow-sm mr-8 sm:mr-0" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                                        <meta itemProp="ratingValue" content={review.rating.toString()} />
                                        <meta itemProp="bestRating" content="5" />
                                        <Star size={12} className="text-amber-500 fill-amber-500 mr-1" />
                                        <span className="text-xs font-bold text-ink dark:text-stone-200">{review.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                {review.status === 'pending' && (
                                     <div className="flex items-center gap-1 opacity-60 mr-28 sm:mr-24">
                                        <Star size={12} className="text-amber-500/50 fill-amber-500/50" />
                                        <span className="text-xs font-bold text-stone-400">{review.rating.toFixed(1)}</span>
                                     </div>
                                )}
                            </div>
                            
                            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed pl-1" itemProp="reviewBody">
                                {review.comment}
                            </p>
                            
                            {currentUser?.id === review.userId && (
                                <div className="flex justify-end mt-3 pt-2 border-t border-stone-100 dark:border-stone-700/50 border-dashed">
                                    <button 
                                        onClick={() => handleDelete(review.id)}
                                        className="text-xs text-stone-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 size={12} /> Delete Review
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Submission Form */}
            <div className="bg-white dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
                {!currentUser ? (
                    <div className="text-center py-4">
                        <p className="text-stone-600 dark:text-stone-400 mb-3">Join the community to leave your review.</p>
                        <button 
                            onClick={onLoginReq}
                            className="px-6 py-2 bg-ink dark:bg-stone-700 text-white rounded-full font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-600 transition-colors"
                        >
                            Sign In to Review
                        </button>
                    </div>
                ) : submitted ? (
                    <div className="text-center py-6 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900 animate-fade-in">
                        <ShieldCheck className="mx-auto mb-2" size={32} />
                        <h4 className="font-bold">Review Submitted!</h4>
                        <p className="text-sm">Your review is pending moderator approval.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-4 text-xs underline text-green-800 dark:text-green-300">Write another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h4 className="font-bold text-ink dark:text-stone-100 flex items-center gap-2">
                             Write a Review <span className="text-xs font-normal text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">Public</span>
                        </h4>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Your Rating</label>
                            <div className="flex gap-1 cursor-pointer group">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        size={24} 
                                        className={`transition-all duration-200 ${star <= rating ? "text-amber-500 fill-amber-500 scale-110" : "text-stone-300 dark:text-stone-600 hover:text-amber-300 hover:scale-110"}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Your Thoughts</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 focus:border-accent outline-none text-sm h-24 resize-none text-ink dark:text-stone-100 placeholder-stone-400 transition-colors"
                                placeholder="What did you love? What made you think?"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={rating === 0 || !comment}
                            className="w-full py-2 bg-ink dark:bg-stone-700 text-white rounded-lg font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-600 disabled:opacity-50 transition-all transform active:scale-[0.99]"
                        >
                            Submit for Approval
                        </button>
                        <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
                            <Shield size={10} /> Reviews are moderated to ensure quality.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};