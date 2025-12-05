import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

// Initialize the client
// The API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Searches for books using Gemini with Google Search Grounding to get real data.
 */
export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 highly-rated books related to this query: "${query}". 
      Prioritize books with high ratings (4.0+) and critical acclaim. 
      Ensure descriptions are detailed, engaging, and capture the narrative depth (approx 3 sentences).
      Return a RAW JSON array (no markdown formatting, no code blocks) where each object has: 
      - title
      - author
      - description (detailed)
      - rating (approximate 0-5)
      - moods (array of strings)
      - publishedDate (year or short date string)
      - pageCount (approximate number)
      - awards (array of major awards won, if any)
      - series (series name and number, e.g. "Dune #1", if applicable)
      - characters (array of main character names).`,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are not allowed when using tools
      },
    });

    let text = response.text;
    if (!text) return [];
    
    // Clean markdown code blocks if present since we can't use JSON mode with tools
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(text);
    return data.map((item: any, index: number) => ({
      ...item,
      id: `search-${index}-${Date.now()}`,
      coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450` // Placeholder as search doesn't return images easily
    }));
  } catch (error) {
    console.error("Search failed", error);
    return [];
  }
};

/**
 * Chat with a "Librarian" persona.
 */
export const chatWithLibrarian = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: "You are OhMyReads, a sophisticated, well-read, and warm librarian AI. You love helping people find books. Keep answers concise but insightful."
        }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
}

/**
 * Get personalized recommendations (Simulated for Home Page)
 */
export const getCuratedList = async (): Promise<Book[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "List 4 trending, diverse fiction books from the last 5 years that have high literary merit. Return JSON. Include awards if any.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            author: { type: Type.STRING },
                            moods: { type: Type.ARRAY, items: { type: Type.STRING } },
                             rating: { type: Type.NUMBER },
                             awards: { type: Type.ARRAY, items: { type: Type.STRING } },
                             series: { type: Type.STRING },
                             characters: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        });

         const text = response.text;
         if (!text) return [];
         const data = JSON.parse(text);
         return data.map((item: any, index: number) => ({
             ...item,
             id: `curated-${index}`,
             coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
             description: "A trending masterpiece selected just for you."
         }));

    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Get "Community Favorites" - Books that generate high engagement/discussion
 */
export const getCommunityFavorites = async (): Promise<Book[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "List 4 books that are considered 'Cult Classics' or 'Viral Hits' in modern online book communities (like BookTok or Goodreads). Books that generate intense discussion and have passionate fanbases. Return JSON.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            author: { type: Type.STRING },
                            moods: { type: Type.ARRAY, items: { type: Type.STRING } },
                            rating: { type: Type.NUMBER },
                            description: { type: Type.STRING }
                        }
                    }
                }
            }
        });

         const text = response.text;
         if (!text) return [];
         const data = JSON.parse(text);
         return data.map((item: any, index: number) => ({
             ...item,
             id: `community-${index}`,
             coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
             // description is fetched from AI
         }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * Get "The Zeitgeist" - Real-time trends using Google Search Grounding
 */
export const getRealTimeTrends = async (): Promise<Book[]> => {
    try {
        // We use Google Search to get the ACTUAL current bestsellers
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Search for the current New York Times Fiction Bestseller list and trending books for this week. 
            Identify 4 top fiction books that are currently trending right now.
            Return a RAW JSON array (no markdown) where each object has: title, author, description, rating (estimate), moods.`,
            config: {
                tools: [{ googleSearch: {} }],
                // No responseMimeType allowed with tools
            }
        });

        let text = response.text;
        if (!text) return [];
        
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const data = JSON.parse(text);
        return data.map((item: any, index: number) => ({
             ...item,
             id: `zeitgeist-${index}`,
             coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
        }));
    } catch (e) {
        console.error("Zeitgeist fetch failed", e);
        return [];
    }
}

/**
 * Placeholder image generator since we removed visualizer
 */
export const generateBookEssence = async (title: string, author: string, style: string): Promise<string | null> => {
    return null; 
}