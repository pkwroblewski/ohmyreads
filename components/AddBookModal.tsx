import React, { useState } from 'react';
import { Book } from '../types';
import { X, BookPlus, Loader2 } from 'lucide-react';

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (book: Partial<Book>) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [description, setDescription] = useState('');
    const [pageCount, setPageCount] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate a small delay for better UX feeling
        setTimeout(() => {
            onAdd({
                title,
                author,
                coverUrl,
                description,
                pageCount: parseInt(pageCount) || 0
            });
            // Reset form
            setTitle('');
            setAuthor('');
            setCoverUrl('');
            setDescription('');
            setPageCount('');
            setLoading(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink/40 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-scale-in transition-colors">
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-ink dark:hover:text-white"><X size={20}/></button>
                
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-700 dark:text-green-500 mx-auto mb-3">
                        <BookPlus size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">Add to Library</h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Manually add a book to your personal collection.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Title *</label>
                            <input 
                                required
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                placeholder="The Great Gatsby"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Author *</label>
                            <input 
                                required
                                type="text" 
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                placeholder="F. Scott Fitzgerald"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Page Count</label>
                             <input 
                                 type="number" 
                                 value={pageCount}
                                 onChange={(e) => setPageCount(e.target.value)}
                                 className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                 placeholder="180"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Cover URL (Optional)</label>
                             <input 
                                 type="url" 
                                 value={coverUrl}
                                 onChange={(e) => setCoverUrl(e.target.value)}
                                 className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                 placeholder="https://..."
                             />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white resize-none h-24"
                                placeholder="Short synopsis..."
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!title || !author || loading}
                        className="w-full py-3 bg-ink dark:bg-stone-700 text-white rounded-lg font-bold hover:bg-stone-800 dark:hover:bg-stone-600 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <><BookPlus size={18} /> Add Book</>}
                    </button>
                </form>
            </div>
        </div>
    );
};