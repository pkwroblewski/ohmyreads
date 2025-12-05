import React from 'react';
import { Book, User } from '../types';
import { X, Star, PlayCircle, Calendar, Trophy, Users, Layers, ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react';
import { ReviewSection } from './ReviewSection';
import { getAffiliateLinks, trackAffiliateClick, AffiliateProvider } from '../lib/affiliates';

interface BookDetailsModalProps {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    currentUser: User | null;
    onLoginReq: () => void;
    onStartReading?: (book: Book) => void;
    onAskConcierge?: (query: string) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ 
    book, isOpen, onClose, currentUser, onLoginReq, onStartReading, onAskConcierge 
}) => {
    if (!isOpen) return null;

    const affiliateLinks = getAffiliateLinks(book);
    
    const handlePurchaseClick = (provider: AffiliateProvider, url: string) => {
        trackAffiliateClick(book, provider);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-fade-in-up transition-colors">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white dark:bg-black/30 dark:hover:bg-black/50 rounded-full transition-all z-10"
                >
                    <X size={20} className="text-ink dark:text-white" />
                </button>

                <div className="overflow-y-auto flex-1">
                    {/* Header Image */}
                    <div className="h-64 relative">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h2 className="text-3xl font-serif font-bold mb-1">{book.title}</h2>
                            <p className="text-lg opacity-90">{book.author}</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-3 py-1 rounded-full text-xs font-bold">
                                <Star size={14} className="fill-amber-700 dark:fill-amber-500" />
                                {book.rating ? book.rating.toFixed(1) : 'N/A'}
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-medium border-l border-stone-300 dark:border-stone-700 pl-3">
                                <span>{book.pageCount ? `${book.pageCount} pages` : 'Length unknown'}</span>
                                {book.publishedDate && (
                                  <>
                                    <span className="w-1 h-1 bg-stone-300 dark:bg-stone-600 rounded-full"></span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {book.publishedDate}</span>
                                  </>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {book.moods?.map(mood => (
                                    <span key={mood} className="text-[10px] uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-1 rounded-sm">
                                        {mood}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 font-serif text-lg">
                            {book.description || "No description available for this title, but its cover suggests a fascinating journey awaits."}
                        </p>

                        {/* Extended Metadata Section */}
                        {(book.series || (book.awards && book.awards.length > 0) || (book.characters && book.characters.length > 0)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
                                {book.series && (
                                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                                        <Layers size={16} className="mt-0.5 text-accent shrink-0" />
                                        <div>
                                            <span className="block font-bold text-ink dark:text-stone-200">Series</span>
                                            {book.series}
                                        </div>
                                    </div>
                                )}
                                
                                {book.awards && book.awards.length > 0 && (
                                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                                        <Trophy size={16} className="mt-0.5 text-accent shrink-0" />
                                        <div>
                                            <span className="block font-bold text-ink dark:text-stone-200">Awards</span>
                                            <ul className="list-disc list-inside">
                                                {book.awards.map(award => <li key={award}>{award}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {book.characters && book.characters.length > 0 && (
                                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400 md:col-span-2">
                                        <Users size={16} className="mt-0.5 text-accent shrink-0" />
                                        <div>
                                            <span className="block font-bold text-ink dark:text-stone-200">Main Characters</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {book.characters.map(char => (
                                                    <span key={char} className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-xs">
                                                        {char}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <button 
                                onClick={() => onStartReading?.(book)}
                                className="w-full bg-ink dark:bg-stone-700 text-white py-3.5 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-stone-200 dark:shadow-none"
                            >
                                <PlayCircle size={18} /> Start Reading
                            </button>
                            
                            {onAskConcierge && (
                                <button 
                                    onClick={() => {
                                        onClose();
                                        onAskConcierge(`Find books similar to "${book.title}" by ${book.author}`);
                                    }}
                                    className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400 py-3 rounded-xl font-bold border border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={18} /> Find Similar Books
                                </button>
                            )}

                            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                                <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 flex items-center gap-2">
                                    <ShoppingBag size={14} /> Purchase Options
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {affiliateLinks.map((link) => (
                                        <button 
                                            key={link.provider}
                                            onClick={() => handlePurchaseClick(link.provider, link.url)}
                                            className="flex flex-col items-center justify-center p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:border-accent hover:text-accent transition-all group"
                                        >
                                            <span className="font-bold text-sm text-ink dark:text-stone-200 group-hover:text-accent">{link.label}</span>
                                            <ExternalLink size={10} className="mt-1 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-stone-400 mt-2 text-center">Purchases may support OhMyReads.</p>
                            </div>
                        </div>

                        <ReviewSection bookId={book.id} currentUser={currentUser} onLoginReq={onLoginReq} />
                    </div>
                </div>
            </div>
        </div>
    );
};