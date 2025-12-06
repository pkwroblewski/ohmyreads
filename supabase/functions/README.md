# 🔐 Supabase Edge Functions - Secure AI

This folder contains Supabase Edge Functions that keep your API keys secure.

## Why Edge Functions?

**Without Edge Functions (INSECURE):**
```
User → Browser → Gemini API (API key exposed in JavaScript!)
```

**With Edge Functions (SECURE):**
```
User → Browser → Supabase Edge Function → Gemini API
                 (API key hidden on server)
```

---

## 📦 Available Functions

### `gemini-ai`
A single function that handles all Gemini AI operations:
- `search` - Search for books
- `chat` - Chat with the AI librarian
- `curated` - Get curated book list
- `community` - Get community favorites
- `trends` - Get trending books

---

## 🚀 Deployment Steps

### Step 1: Install Supabase CLI

**Windows (with npm):**
```bash
npm install -g supabase
```

**Or download directly:**
https://github.com/supabase/cli/releases

### Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window to authenticate.

### Step 3: Link Your Project

```bash
cd "C:\Users\bitpk\Desktop\OhMyReads Gemini"
supabase link --project-ref wbocqxstlowryeqjajzd
```

### Step 4: Set Your Gemini API Key (SECRET)

```bash
supabase secrets set GEMINI_API_KEY=your_actual_gemini_api_key_here
```

⚠️ **IMPORTANT**: This key is stored securely on Supabase servers, NOT in your code!

### Step 5: Deploy the Function

```bash
supabase functions deploy gemini-ai
```

### Step 6: Verify Deployment

Go to: https://supabase.com/dashboard/project/wbocqxstlowryeqjajzd/functions

You should see `gemini-ai` listed.

---

## 🧪 Testing

You can test the function directly:

```bash
curl -X POST https://wbocqxstlowryeqjajzd.supabase.co/functions/v1/gemini-ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"action": "curated"}'
```

---

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `supabase login` | Authenticate with Supabase |
| `supabase link` | Connect local project to Supabase |
| `supabase secrets set KEY=value` | Set secure environment variable |
| `supabase functions deploy NAME` | Deploy a function |
| `supabase functions list` | List deployed functions |
| `supabase functions delete NAME` | Remove a function |

---

## 🔑 Getting a Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Run: `supabase secrets set GEMINI_API_KEY=your_key`

---

## ✅ Security Checklist

- [ ] Gemini API key is set via `supabase secrets set`
- [ ] Frontend NO LONGER has `VITE_GEMINI_API_KEY` 
- [ ] Edge function is deployed
- [ ] App calls Edge Function instead of Gemini directly

Your API key is now completely hidden from users! 🎉

