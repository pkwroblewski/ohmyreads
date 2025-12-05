import React, { useState, useEffect } from 'react';
import { generateBookEssence } from '../services/geminiService';
import { Loader2, Palette, Download, Share2 } from 'lucide-react';

interface VisualizerProps {
  initialData?: {
    title: string;
    author: string;
  } | null;
}

export const Visualizer: React.FC<VisualizerProps> = ({ initialData }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [style, setStyle] = useState('Oil Painting');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setBookTitle(initialData.title);
      setAuthor(initialData.author);
    }
  }, [initialData]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !author) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateBookEssence(bookTitle, author, style);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError("Could not generate image. Please try again.");
      }
    } catch (err) {
      setError("Error generating image. Ensure API limits are not exceeded.");
    } finally {
      setLoading(false);
    }
  };

  const styles = ['Oil Painting', 'Minimalist Vector', 'Dark Fantasy Art', 'Watercolor', 'Cyberpunk', 'Vintage Poster'];

  return (
    <div className="grid lg:grid-cols-2 gap-12 h-full">
      {/* Input Section */}
      <div className="space-y-8">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
              <Palette size={12} />
              Nano Banana Pro
           </div>
          <h2 className="text-4xl font-serif font-bold text-ink dark:text-stone-100 mb-3">Visual Essence</h2>
          <p className="text-stone-500 dark:text-stone-400">
            Visualize the soul of a story. We use the advanced <strong>Gemini 3 Pro Image</strong> model to interpret the themes, mood, and setting of a book into a unique piece of concept art.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6 bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
          <div>
            <label className="block text-sm font-bold text-ink dark:text-stone-100 mb-1">Book Title</label>
            <input 
              type="text" 
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white placeholder-stone-400"
              placeholder="e.g. Dune"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink dark:text-stone-100 mb-1">Author</label>
            <input 
              type="text" 
              className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:border-accent outline-none text-ink dark:text-white placeholder-stone-400"
              placeholder="e.g. Frank Herbert"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-ink dark:text-stone-100 mb-2">Art Style</label>
            <div className="grid grid-cols-2 gap-2">
                {styles.map(s => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setStyle(s)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${style === s ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !bookTitle}
            className="w-full py-3 bg-ink dark:bg-stone-700 text-white font-bold rounded-lg hover:bg-stone-800 dark:hover:bg-stone-600 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" /> Dreaming...</> : 'Generate Essence'}
          </button>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>

      {/* Output Section */}
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-stone-100 dark:bg-stone-900 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 relative overflow-hidden p-4 transition-colors">
        {generatedImage ? (
          <div className="relative group w-full h-full flex flex-col items-center">
            <img 
              src={generatedImage} 
              alt="Generated Essence" 
              className="max-h-[600px] w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-3 bg-white dark:bg-stone-800 rounded-full shadow-lg text-ink dark:text-white hover:text-accent"><Download size={20}/></button>
                <button className="p-3 bg-white dark:bg-stone-800 rounded-full shadow-lg text-ink dark:text-white hover:text-accent"><Share2 size={20}/></button>
            </div>
          </div>
        ) : (
          <div className="text-center text-stone-400">
             <div className="w-16 h-16 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-stone-400" size={32} />
             </div>
             <p className="font-medium">Your art will appear here.</p>
             <p className="text-sm">Enter a book details to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};