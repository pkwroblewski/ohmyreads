import React, { useState } from 'react';
import { X, UserCheck, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle, resetPassword, isConfigured } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            if (!isConfigured) {
                // Fallback to mock auth for demo
                const mockUser: User = {
                    id: `user-${Date.now()}`,
                    name: email.split('@')[0] || 'User',
                    role: email.includes('admin') ? 'admin' : 'user',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                };
                onLogin(mockUser);
                onClose();
                return;
            }

            if (mode === 'signin') {
                await signIn(email, password);
                // Auth state will update via listener, create mock user for now
                const user: User = {
                    id: `user-${Date.now()}`,
                    name: email.split('@')[0],
                    role: 'user',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                };
                onLogin(user);
                onClose();
            } else if (mode === 'signup') {
                await signUp(email, password, username);
                setMessage('Check your email to confirm your account!');
            } else if (mode === 'forgot') {
                await resetPassword(email);
                setMessage('Password reset email sent!');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!isConfigured) {
            setError('Supabase not configured. Using demo mode.');
            return;
        }
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setUsername('');
        setError(null);
        setMessage(null);
    };

    const switchMode = (newMode: AuthMode) => {
        resetForm();
        setMode(newMode);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink/40 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-scale-in transition-colors">
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-ink dark:hover:text-white">
                    <X size={20}/>
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                        <UserCheck size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-ink dark:text-stone-100">
                        {mode === 'signin' && 'Welcome Back'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot' && 'Reset Password'}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {mode === 'signin' && 'Sign in to track books and connect with readers.'}
                        {mode === 'signup' && 'Join our community of book lovers.'}
                        {mode === 'forgot' && 'Enter your email to reset your password.'}
                    </p>
                    {!isConfigured && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                            Demo mode: Supabase not configured
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Username</label>
                            <div className="relative">
                                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
                                    className="w-full p-3 pl-10 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full p-3 pl-10 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    {mode !== 'forgot' && (
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Your password'}
                                    className="w-full p-3 pl-10 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white"
                                    required
                                    minLength={mode === 'signup' ? 6 : undefined}
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-ink dark:bg-stone-700 text-white rounded-lg font-bold hover:bg-stone-800 dark:hover:bg-stone-600 disabled:opacity-50 transition-all flex justify-center"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Processing...
                            </span>
                        ) : (
                            <>
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Create Account'}
                                {mode === 'forgot' && 'Send Reset Email'}
                            </>
                        )}
                    </button>
                </form>

                {mode !== 'forgot' && (
                    <>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white dark:bg-stone-900 text-stone-400">or continue with</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full py-3 border border-stone-200 dark:border-stone-700 rounded-lg font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 text-ink dark:text-white"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                    </>
                )}

                <div className="mt-6 text-center text-sm">
                    {mode === 'signin' && (
                        <>
                            <button 
                                onClick={() => switchMode('forgot')} 
                                className="text-accent hover:underline"
                            >
                                Forgot password?
                            </button>
                            <p className="text-stone-500 dark:text-stone-400 mt-2">
                                Don't have an account?{' '}
                                <button onClick={() => switchMode('signup')} className="text-accent hover:underline font-medium">
                                    Sign up
                                </button>
                            </p>
                        </>
                    )}
                    {mode === 'signup' && (
                        <p className="text-stone-500 dark:text-stone-400">
                            Already have an account?{' '}
                            <button onClick={() => switchMode('signin')} className="text-accent hover:underline font-medium">
                                Sign in
                            </button>
                        </p>
                    )}
                    {mode === 'forgot' && (
                        <button onClick={() => switchMode('signin')} className="text-accent hover:underline">
                            Back to sign in
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
