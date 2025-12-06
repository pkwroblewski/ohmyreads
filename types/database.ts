/**
 * Supabase Database Types
 * 
 * These types define the structure of our Supabase database tables.
 * Update these when you modify the database schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          cover_image_url: string | null
          is_public: boolean
          reader_type: string | null
          favorite_genres: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          reader_type?: string | null
          favorite_genres?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          reader_type?: string | null
          favorite_genres?: string[] | null
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          cover_url: string | null
          description: string | null
          isbn: string | null
          page_count: number | null
          published_date: string | null
          genres: string[] | null
          average_rating: number | null
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          cover_url?: string | null
          description?: string | null
          isbn?: string | null
          page_count?: number | null
          published_date?: string | null
          genres?: string[] | null
          average_rating?: number | null
          review_count?: number
          created_at?: string
        }
        Update: {
          title?: string
          author?: string
          cover_url?: string | null
          description?: string | null
          isbn?: string | null
          page_count?: number | null
          published_date?: string | null
          genres?: string[] | null
          average_rating?: number | null
          review_count?: number
        }
      }
      user_books: {
        Row: {
          id: string
          user_id: string
          book_id: string
          status: 'want_to_read' | 'reading' | 'finished' | 'dnf'
          progress: number
          start_date: string | null
          finish_date: string | null
          personal_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          status?: 'want_to_read' | 'reading' | 'finished' | 'dnf'
          progress?: number
          start_date?: string | null
          finish_date?: string | null
          personal_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'want_to_read' | 'reading' | 'finished' | 'dnf'
          progress?: number
          start_date?: string | null
          finish_date?: string | null
          personal_rating?: number | null
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          book_id: string
          rating: number
          title: string | null
          content: string | null
          contains_spoilers: boolean
          likes_count: number
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          rating: number
          title?: string | null
          content?: string | null
          contains_spoilers?: boolean
          likes_count?: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          rating?: number
          title?: string | null
          content?: string | null
          contains_spoilers?: boolean
          likes_count?: number
          status?: 'pending' | 'approved' | 'rejected'
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: never
      }
      reading_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          cover_image_url: string | null
          created_by: string
          is_public: boolean
          member_count: number
          current_book_id: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cover_image_url?: string | null
          created_by: string
          is_public?: boolean
          member_count?: number
          current_book_id?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          member_count?: number
          current_book_id?: string | null
          tags?: string[] | null
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          role?: 'owner' | 'admin' | 'member'
        }
      }
      activity_feed: {
        Row: {
          id: string
          user_id: string
          type: 'started_reading' | 'finished_book' | 'review' | 'joined_group' | 'achievement' | 'follow'
          content: string
          book_id: string | null
          group_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'started_reading' | 'finished_book' | 'review' | 'joined_group' | 'achievement' | 'follow'
          content: string
          book_id?: string | null
          group_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: never
      }
      user_stats: {
        Row: {
          user_id: string
          books_read: number
          pages_read: number
          reviews_written: number
          followers_count: number
          following_count: number
          current_streak: number
          longest_streak: number
          updated_at: string
        }
        Insert: {
          user_id: string
          books_read?: number
          pages_read?: number
          reviews_written?: number
          followers_count?: number
          following_count?: number
          current_streak?: number
          longest_streak?: number
          updated_at?: string
        }
        Update: {
          books_read?: number
          pages_read?: number
          reviews_written?: number
          followers_count?: number
          following_count?: number
          current_streak?: number
          longest_streak?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      book_status: 'want_to_read' | 'reading' | 'finished' | 'dnf'
      review_status: 'pending' | 'approved' | 'rejected'
      member_role: 'owner' | 'admin' | 'member'
      activity_type: 'started_reading' | 'finished_book' | 'review' | 'joined_group' | 'achievement' | 'follow'
    }
  }
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Book = Database['public']['Tables']['books']['Row']
export type UserBook = Database['public']['Tables']['user_books']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']
export type ReadingGroup = Database['public']['Tables']['reading_groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type ActivityFeedItem = Database['public']['Tables']['activity_feed']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']
