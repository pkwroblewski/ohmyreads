import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { AuthService } from '../services/mockBackend';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay
        setTimeout(async () => {
            const user = await AuthService.login(username);
            if (user) {
                onLogin(user);
                onClose();
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-ink/40 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
             <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-scale-in transition-colors">
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-ink dark:hover:text-white"><X size={20}/></button>
                
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                        <UserCheck size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">Welcome to OhMyReads</h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Sign in to track books and write reviews.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Try 'admin' or 'alice'"
                            className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                            autoFocus
                        />
                         <p className="text-[10px] text-stone-400 mt-1">For demo: Type "admin" for moderation, or any name for regular user.</p>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!username || loading}
                        className="w-full py-3 bg-ink dark:bg-stone-700 text-white rounded-lg font-bold hover:bg-stone-800 dark:hover:bg-stone-600 disabled:opacity-50 transition-all flex justify-center"
                    >
                        {loading ? "Authenticating..." : "Continue"}
                    </button>
                </form>
             </div>
        </div>
    );
};