import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, BookOpen, Sparkles, Trash2 } from 'lucide-react';
import { getConciergeResponse, ConciergeResponse } from '../services/recommendations';
import { ChatMessage, Book } from '../types';
import { db, STORAGE_KEYS } from '../lib/database';
import { trackEvent } from '../lib/analytics';

interface AILibrarianProps {
  onBookClick?: (book: Book) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  initialMessage?: string;
}

interface EnrichedMessage extends ChatMessage {
  suggestions?: string[];
  books?: Book[];
}

const WELCOME_MESSAGE: EnrichedMessage = {
  id: '1',
  role: 'model',
  text: "Hello! 📚 I'm your Book Concierge. I can help you discover your next great read! Ask me for recommendations by genre, mood, or just tell me what you're in the mood for.",
  suggestions: ['Fantasy books', 'Feel-good reads', 'Mystery novels', 'What\'s trending?']
};

export const AILibrarian: React.FC<AILibrarianProps> = ({ 
  onBookClick, 
  isOpen: externalIsOpen, 
  onToggle,
  initialMessage 
}) => {
  // Use external control if provided, otherwise internal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const [messages, setMessages] = useState<EnrichedMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  // Load persisted chat history on mount
  useEffect(() => {
    const savedMessages = db.get<EnrichedMessage[]>(STORAGE_KEYS.AI_CHAT_HISTORY, []);
    if (savedMessages.length > 0) {
      setMessages([WELCOME_MESSAGE, ...savedMessages]);
    }
  }, []);

  // Save messages to localStorage when they change (excluding welcome message)
  useEffect(() => {
    const messagesToSave = messages.filter(m => m.id !== '1');
    if (messagesToSave.length > 0) {
      db.set(STORAGE_KEYS.AI_CHAT_HISTORY, messagesToSave);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle initial message when opening with context
  useEffect(() => {
    if (isOpen && initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      // Small delay to allow UI to render
      setTimeout(() => {
        handleSend(initialMessage);
      }, 300);
    }
    
    // Reset when closed
    if (!isOpen) {
      hasProcessedInitialMessage.current = false;
    }
  }, [isOpen, initialMessage]);

  const handleToggle = (open: boolean) => {
    if (onToggle) {
      onToggle(open);
    } else {
      setInternalIsOpen(open);
    }
    
    if (open) {
      trackEvent('book_search', { source: 'ai_librarian' });
    }
  };

  const handleSend = useCallback(async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMsg: EnrichedMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response: ConciergeResponse = await getConciergeResponse(text);

      const botMsg: EnrichedMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text,
        suggestions: response.suggestions,
        books: response.books
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: EnrichedMessage = { 
        id: 'err-' + Date.now(), 
        role: 'model', 
        text: "Oops! I had trouble searching the shelves. Please try again!" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleBookClick = (book: Book) => {
    if (onBookClick) {
      onBookClick(book);
      handleToggle(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
    db.remove(STORAGE_KEYS.AI_CHAT_HISTORY);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => handleToggle(true)}
          className="w-14 h-14 bg-ink dark:bg-stone-700 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-stone-800 dark:hover:bg-stone-600 transition-all hover:scale-105 group"
          aria-label="Open Book Concierge"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-stone-900 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col animate-fade-in-up transition-colors">
          {/* Header */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-gradient-to-r from-stone-50 to-amber-50/50 dark:from-stone-900 dark:to-stone-900/50 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink dark:text-stone-100 text-sm">Book Concierge</h3>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
                  Ready to help you discover
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button 
                  onClick={handleClearHistory}
                  className="text-stone-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label="Clear chat history"
                  title="Clear chat history"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button 
                onClick={() => handleToggle(false)} 
                className="text-stone-400 hover:text-ink dark:hover:text-white p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] space-y-3`}>
                  {/* Message bubble */}
                  <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-ink dark:bg-stone-700 text-white rounded-br-none' 
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none'
                    }`}>
                        {msg.text}
                  </div>
                  
                  {/* Suggestion chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:border-accent hover:text-accent transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Book recommendations */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {msg.books.map((book) => (
                        <button
                          key={book.id}
                          onClick={() => handleBookClick(book)}
                          className="bg-white dark:bg-stone-800 rounded-lg p-2 border border-stone-200 dark:border-stone-700 hover:border-accent transition-colors text-left group"
                        >
                          <div className="flex gap-2">
                            <img 
                              src={book.coverUrl} 
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-ink dark:text-stone-100 truncate group-hover:text-accent transition-colors">
                                {book.title}
                              </p>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                                {book.author}
                              </p>
                              {book.rating && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                                  ★ {book.rating.toFixed(1)}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                    </div>
                </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 rounded-b-2xl">
            <div className="flex items-center gap-2 bg-white dark:bg-stone-800 rounded-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask for a recommendation..."
                className="flex-1 bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-stone-400"
                />
              <button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isLoading} 
                className="text-ink dark:text-stone-300 hover:text-accent dark:hover:text-accent disabled:opacity-30 transition-colors p-1"
                aria-label="Send message"
              >
                    <Send size={18} />
                </button>
            </div>
            <p className="text-[10px] text-center text-stone-400 mt-2">
              Powered by Open Library • Millions of books at your fingertips
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
