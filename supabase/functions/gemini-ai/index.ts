// Supabase Edge Function for Gemini AI Operations
// This keeps your API key secure on the server side

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI, SchemaType } from "npm:@google/generative-ai@0.24.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Gemini with server-side API key
const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Book response schema for structured output
const bookSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING },
      author: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING },
      rating: { type: SchemaType.NUMBER },
      moods: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      publishedDate: { type: SchemaType.STRING },
      pageCount: { type: SchemaType.NUMBER },
      awards: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      series: { type: SchemaType.STRING },
      characters: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    },
  },
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();

    // Check if API key is configured
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;

    switch (action) {
      case "search":
        result = await searchBooks(payload.query);
        break;

      case "chat":
        result = await chatWithLibrarian(payload.history, payload.message);
        break;

      case "curated":
        result = await getCuratedList();
        break;

      case "community":
        result = await getCommunityFavorites();
        break;

      case "trends":
        result = await getRealTimeTrends();
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ============================================
// AI Functions (now server-side secure!)
// ============================================

async function searchBooks(query: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: bookSchema,
    },
  });

  const prompt = `Find 5 highly-rated books related to this query: "${query}". 
    Prioritize books with high ratings (4.0+) and critical acclaim. 
    Ensure descriptions are detailed, engaging, and capture the narrative depth (approx 3 sentences).
    Return JSON array where each object has: title, author, description, rating (0-5), moods, publishedDate, pageCount, awards, series, characters.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) return [];

  const data = JSON.parse(text);
  return data.map((item: any, index: number) => ({
    ...item,
    id: `search-${index}-${Date.now()}`,
    coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
  }));
}

async function chatWithLibrarian(
  history: { role: string; parts: { text: string }[] }[],
  message: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction:
      "You are OhMyReads, a sophisticated, well-read, and warm librarian AI. You love helping people find books. Keep answers concise but insightful.",
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  return { response: result.response.text() };
}

async function getCuratedList() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            author: { type: SchemaType.STRING },
            moods: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            rating: { type: SchemaType.NUMBER },
            awards: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            series: { type: SchemaType.STRING },
            characters: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
        },
      },
    },
  });

  const result = await model.generateContent(
    "List 4 trending, diverse fiction books from the last 5 years that have high literary merit. Return JSON. Include awards if any."
  );
  const text = result.response.text();

  if (!text) return [];

  const data = JSON.parse(text);
  return data.map((item: any, index: number) => ({
    ...item,
    id: `curated-${index}`,
    coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
    description: "A trending masterpiece selected just for you.",
  }));
}

async function getCommunityFavorites() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            author: { type: SchemaType.STRING },
            moods: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            rating: { type: SchemaType.NUMBER },
            description: { type: SchemaType.STRING },
          },
        },
      },
    },
  });

  const result = await model.generateContent(
    "List 4 books that are considered 'Cult Classics' or 'Viral Hits' in modern online book communities (like BookTok or Goodreads). Books that generate intense discussion and have passionate fanbases. Return JSON."
  );
  const text = result.response.text();

  if (!text) return [];

  const data = JSON.parse(text);
  return data.map((item: any, index: number) => ({
    ...item,
    id: `community-${index}`,
    coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
  }));
}

async function getRealTimeTrends() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            author: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            rating: { type: SchemaType.NUMBER },
            moods: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
        },
      },
    },
  });

  const prompt = `List 4 recent popular fiction books that are currently trending. Consider New York Times bestsellers and popular titles. Return JSON array with: title, author, description, rating (estimate), moods.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) return [];

  const data = JSON.parse(text);
  return data.map((item: any, index: number) => ({
    ...item,
    id: `zeitgeist-${index}`,
    coverUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/450`,
  }));
}

