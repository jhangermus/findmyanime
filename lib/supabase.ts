import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export type UserProfile = {
  id: string
  username: string
  email: string
  avatar_url?: string
  created_at: string
}

export type WatchlistItem = {
  id: string
  user_id: string
  anime_id: string
  status: 'watching' | 'completed' | 'planning' | 'dropped'
  rating?: number
  created_at: string
  updated_at: string
} 