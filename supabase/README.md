# OhMyReads Supabase Setup

## Quick Setup Guide

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `ohmyreads`
5. Set a strong database password (save it!)
6. Select the region closest to your users
7. Click "Create new project"

### 2. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migrations

1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New query"
3. Copy and paste the contents of `001_create_tables.sql`
4. Click "Run" (or press Ctrl+Enter)
5. Repeat for `002_rls_policies.sql`

### 5. Enable Authentication Providers (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Google** (recommended):
   - Create OAuth credentials in Google Cloud Console
   - Add Client ID and Secret
3. Enable **Email** (enabled by default):
   - Configure email templates if desired

### 6. Test the Setup

1. Start the dev server: `npm run dev`
2. Try signing up with email
3. Check the `profiles` table in Supabase for the new user

## Database Schema Overview

```
profiles          → User profiles (extends auth.users)
user_stats        → Aggregated user statistics
books             → Book catalog
user_books        → User's personal library
reviews           → Book reviews
follows           → User follow relationships
reading_groups    → Book clubs
group_members     → Group membership
activity_feed     → Social activity feed
```

## Troubleshooting

### "Supabase credentials not found"
- Make sure `.env.local` exists with valid credentials
- Restart the dev server after adding environment variables

### "permission denied for table"
- Make sure you ran `002_rls_policies.sql`
- Check that the user is authenticated

### "duplicate key value violates unique constraint"
- This is expected if you try to sign up with the same email twice
- The profile trigger creates a profile automatically on signup

