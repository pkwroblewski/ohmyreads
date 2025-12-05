import React, { useState, useEffect } from 'react';
import { User, BlogPost } from '../types';
import { BlogService } from '../services/mockBackend';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { usePageMeta, PAGE_META } from '../hooks/usePageMeta';
import { PenTool, Trash2, Calendar, User as UserIcon, Plus, X } from 'lucide-react';

interface BlogProps {
    currentUser: User | null;
}

export const Blog: React.FC<BlogProps> = ({ currentUser }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    // Set page meta for SEO
    usePageMeta(PAGE_META.blog);

    useEffect(() => {
        setPosts(BlogService.getAll());
    }, []);

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !title || !content) return;

        const newPost = BlogService.add({
            title,
            content,
            author: currentUser.name,
            imageUrl
        });

        setPosts(prev => [newPost, ...prev]);
        setIsCreating(false);
        setTitle('');
        setContent('');
        setImageUrl('');
    };

    const handleDelete = (id: string) => {
        if (confirm("Tear up this note?")) {
            BlogService.delete(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <header className="text-center space-y-4">
                <h2 className="text-5xl font-serif font-bold text-ink dark:text-stone-100 relative inline-block">
                    OhMyBlog
                    <span className="absolute -top-6 -right-8 text-4xl rotate-12">✏️</span>
                </h2>
                <p className="text-lg text-stone-500 dark:text-stone-400 font-serif italic max-w-2xl mx-auto">
                    "Notes from the margins of our literary lives."
                </p>
                
                {currentUser?.role === 'admin' && (
                    <button 
                        onClick={() => setIsCreating(!isCreating)}
                        className={`mt-6 px-6 py-2 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto ${
                            isCreating 
                            ? 'bg-stone-600 hover:bg-stone-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                       {isCreating ? <><X size={18} /> Close Notepad</> : <><Plus size={18} /> Write a Note</>}
                    </button>
                )}
            </header>

            {/* Ad Banner */}
            <AdPlaceholder slot="banner" className="max-w-3xl mx-auto" />

            {/* Admin Editor - Styled like a fresh notepad */}
            {isCreating && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-stone-800 p-8 rounded-sm shadow-xl border-t-8 border-stone-800 dark:border-stone-600 relative rotate-1 mb-16">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 w-4 h-20 bg-stone-200/50 dark:bg-stone-600/50 blur-xl rounded-full"></div>
                     <form onSubmit={handleCreatePost} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Title of your thought..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-2xl font-serif font-bold border-b-2 border-stone-200 dark:border-stone-700 pb-2 outline-none bg-transparent text-ink dark:text-stone-100 placeholder-stone-300"
                        />
                        <input 
                            type="url" 
                            placeholder="Image URL (optional)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full text-sm font-mono text-stone-500 bg-stone-50 dark:bg-stone-900/50 p-2 rounded outline-none"
                        />
                        <textarea 
                            placeholder="Scribble your thoughts here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-40 resize-none outline-none bg-transparent text-lg leading-relaxed text-ink dark:text-stone-200 placeholder-stone-300"
                            style={{ backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 30px)', backgroundSize: '100% 30px', lineHeight: '30px' }}
                        />
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors shadow-md">
                                Pin Note
                            </button>
                        </div>
                     </form>
                </div>
            )}

            {/* Blog Grid - Post-it Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                {posts.map((post, index) => {
                    // Make the first post bigger (featured)
                    const isFeatured = index === 0;
                    
                    return (
                        <div 
                            key={post.id} 
                            className={`relative group transition-transform duration-300 hover:-translate-y-2 hover:z-10 ${
                                isFeatured ? 'md:col-span-2' : ''
                            }`}
                            style={{ transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})` }}
                        >
                            {/* Tape Effect */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-stone-200/80 dark:bg-stone-600/50 rotate-1 shadow-sm z-10 backdrop-blur-[1px]"></div>

                            {/* Note Body */}
                            <div className={`bg-[#FEF9C3] dark:bg-[#423F27] text-stone-800 dark:text-stone-200 shadow-lg flex flex-col relative overflow-hidden h-full ${
                                isFeatured ? 'p-8 pt-12 min-h-[400px]' : 'p-6 pt-10 min-h-[300px]'
                            }`}>
                                {/* Blue Lines Pattern */}
                                <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10" 
                                     style={{ 
                                         backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #3b82f6 28px)',
                                         marginTop: '3.5rem'
                                     }}>
                                </div>

                                {post.imageUrl && (
                                    <div className="mb-4 -mx-6 -mt-4 h-48 overflow-hidden relative border-b-2 border-stone-800/10 shrink-0">
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                )}

                                <div className={`flex flex-col h-full relative z-10 ${isFeatured && !post.imageUrl ? 'md:flex-row md:gap-8' : ''}`}>
                                    
                                    <div className="flex-1 flex flex-col">
                                        <h3 className={`font-serif font-bold mb-2 leading-tight ${
                                            isFeatured ? 'text-4xl mb-4' : 'text-2xl'
                                        }`}>{post.title}</h3>
                                        
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-4">
                                            <span className="flex items-center gap-1"><UserIcon size={12} /> {post.author}</span>
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                                        </div>

                                        <div className={`prose prose-sm font-handwriting leading-relaxed whitespace-pre-wrap flex-1 ${
                                            isFeatured ? 'text-lg' : ''
                                        }`}>
                                            {post.content}
                                        </div>
                                    </div>

                                    {/* Art Area for Featured Post */}
                                    {isFeatured && !post.imageUrl && (
                                        <div className="hidden md:flex w-1/3 shrink-0 items-center justify-center border-l-2 border-stone-800/5 pl-6 ml-2">
                                            {/* Hand-drawn Doodle Art */}
                                            <svg viewBox="0 0 200 200" className="w-full h-auto opacity-60 text-stone-600 dark:text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M40 160 C 20 120, 40 80, 80 80 S 140 120, 160 80" strokeDasharray="5,5" />
                                                <path d="M100 80 L 100 160" />
                                                <path d="M100 80 C 80 60, 60 60, 60 80 C 60 100, 80 100, 100 80" />
                                                <path d="M100 80 C 120 60, 140 60, 140 80 C 140 100, 120 100, 100 80" />
                                                <path d="M100 80 C 90 50, 110 50, 100 80" />
                                                <path d="M 60 140 Q 40 120 50 100" opacity="0.5" />
                                                <circle cx="160" cy="40" r="20" className="animate-pulse" opacity="0.2" fill="currentColor" stroke="none"/>
                                                <path d="M150 150 L 180 180 M 180 150 L 150 180" opacity="0.3"/>
                                            </svg>
                                        </div>
                                    )}

                                </div>

                                {currentUser?.role === 'admin' && (
                                    <button 
                                        onClick={() => handleDelete(post.id)}
                                        className="absolute bottom-0 right-0 p-2 text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-20"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                            
                            {/* Shadow Fold Effect */}
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/5 dark:bg-black/20 transform skew-x-12 translate-y-1 translate-x-1 blur-sm -z-10"></div>
                        </div>
                    );
                })}
            </div>
            
            {posts.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                    <p className="text-xl font-serif">The notice board is empty.</p>
                </div>
            )}
        </div>
    );
};