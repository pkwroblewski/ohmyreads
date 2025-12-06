# 🚀 OhMyReads Supabase Setup Guide

## Quick Copy-Paste Setup

---

## Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub
4. Click **"New Project"** and fill in:
   - **Name**: `ohmyreads`
   - **Database Password**: (generate a strong one and SAVE IT!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait ~2 minutes for setup

---

## Step 2: Get Your Credentials

1. In Supabase Dashboard, go to **⚙️ Settings** → **API**
2. Copy these values:

### Your Project URL:
```
https://YOUR_PROJECT_ID.supabase.co
```

### Your Anon Key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_KEY
```

---

## Step 3: Create .env.local File

Create a file named `.env.local` in your project root (same folder as package.json):

```env
# ============================================
# SUPABASE CONFIGURATION
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
# ============================================

VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# ============================================
# APP CONFIGURATION  
# ============================================

VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=OhMyReads
```

**⚠️ IMPORTANT**: 
- Replace `YOUR_PROJECT_ID` with your actual project ID
- Replace `your_anon_key_here` with your actual anon key
- Never commit `.env.local` to git (it's in .gitignore)

---

## Step 4: Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the ENTIRE contents of `supabase/001_create_tables.sql`
4. Click **"Run"** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"
6. Create another new query
7. Copy and paste the ENTIRE contents of `supabase/002_rls_policies.sql`
8. Click **"Run"**

---

## Step 5: Enable Google OAuth (Optional)

### In Google Cloud Console:

1. Go to **https://console.cloud.google.com**
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. Choose **"Web application"**
6. Add authorized redirect URI:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

### In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **"Enable Sign in with Google"**
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## Step 6: Test Your Setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open **http://localhost:5173**

3. Click **"Sign Up"** and create an account

4. Check Supabase Dashboard → **Table Editor** → **profiles**
   - You should see your new user!

---

## 📋 Quick Reference

### Environment Variables Needed:

| Variable | Where to Get It | Example |
|----------|-----------------|---------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API | `eyJhbGci...` (long string) |

### Files to Run in SQL Editor:

1. `supabase/001_create_tables.sql` - Creates all database tables
2. `supabase/002_rls_policies.sql` - Sets up security policies

### Tables Created:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles |
| `user_stats` | Reading statistics |
| `books` | Book catalog |
| `user_books` | Personal library |
| `reviews` | Book reviews |
| `follows` | User connections |
| `reading_groups` | Book clubs |
| `group_members` | Group membership |
| `activity_feed` | Social activity |

---

## 🔧 Troubleshooting

### "Supabase credentials not found"
- Make sure `.env.local` exists with correct values
- Restart the dev server after creating/editing `.env.local`
- Check there are no typos in variable names

### "Invalid API key"
- Double-check you copied the **anon** key (not service_role)
- Make sure there are no extra spaces or newlines

### "permission denied for table profiles"
- Run `002_rls_policies.sql` in SQL Editor
- Make sure you're authenticated

### "duplicate key value violates unique constraint"
- This happens if you sign up with the same email twice
- This is expected behavior, the user already exists

---

## 🎉 You're Done!

Your OhMyReads app is now connected to Supabase with:
- ✅ User authentication
- ✅ Database for books, reviews, and social features
- ✅ Row-level security
- ✅ Real-time updates capability

Next steps:
- Add some books to your library
- Write reviews
- Connect with other readers!

