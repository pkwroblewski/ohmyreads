import React, { useState, useEffect } from 'react';
import { ReviewService } from '../services/mockBackend';
import { Review } from '../types';
import { Check, X, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

    useEffect(() => {
        setPendingReviews(ReviewService.getPendingReviews());
    }, []);

    const handleApprove = (id: string) => {
        ReviewService.approveReview(id);
        setPendingReviews(prev => prev.filter(r => r.id !== id));
    };

    const handleReject = (id: string) => {
        if(confirm("Permanently delete this review?")) {
            ReviewService.deleteReview(id);
            setPendingReviews(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-ink dark:text-stone-100">Moderation Queue</h2>
                    <p className="text-stone-500 dark:text-stone-400">Qualitative reviews requiring administrator approval.</p>
                </div>
            </header>

            {pendingReviews.length === 0 ? (
                <div className="py-20 text-center text-stone-400 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
                    <p>All caught up! No pending reviews.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingReviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/4 space-y-2 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 pb-4 md:pb-0">
                                <p className="text-xs font-bold uppercase text-stone-400">Reviewer</p>
                                <div className="flex items-center gap-2">
                                    <img src={review.userAvatar} className="w-6 h-6 rounded-full" />
                                    <span className="font-medium text-ink dark:text-stone-100">{review.userName}</span>
                                </div>
                                <p className="text-xs font-bold uppercase text-stone-400 mt-4">Rating</p>
                                <div className="text-amber-500 font-bold">{review.rating} / 5 Stars</div>
                                <p className="text-[10px] text-stone-400 mt-1">{new Date(review.date).toLocaleString()}</p>
                            </div>
                            
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase text-stone-400 mb-2">Content</p>
                                <p className="text-ink dark:text-stone-200 text-sm leading-relaxed bg-stone-50 dark:bg-stone-800 p-4 rounded-lg italic">"{review.comment}"</p>
                            </div>

                            <div className="flex md:flex-col justify-center gap-2">
                                <button 
                                    onClick={() => handleApprove(review.id)}
                                    className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2"
                                    title="Approve"
                                >
                                    <Check size={20} /> <span className="md:hidden text-sm font-bold">Approve</span>
                                </button>
                                <button 
                                    onClick={() => handleReject(review.id)}
                                    className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                                    title="Reject & Delete"
                                >
                                    <X size={20} /> <span className="md:hidden text-sm font-bold">Reject</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};