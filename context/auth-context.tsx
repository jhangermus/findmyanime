"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { WatchlistItem } from '@/lib/supabase'

interface UserProfile {
  id: number
  user_id: string
  username: string
  email: string
  full_name: string | null
  bio: string | null
  created_at: string
}

interface AuthContextType {
  user: UserProfile | null
  watchlist: WatchlistItem[]
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
  addToWatchlist: (animeId: number, status: WatchlistItem['status']) => Promise<void>
  updateWatchlistStatus: (watchlistId: number, status: WatchlistItem['status']) => Promise<void>
  removeFromWatchlist: (watchlistId: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
        fetchWatchlist(session.user.id)
      }
    })

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
        fetchWatchlist(session.user.id)
      } else {
        setUser(null)
        setWatchlist([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return
    }

    setUser(data)
  }

  const fetchWatchlist = async (userId: string) => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching watchlist:', error)
      return
    }

    setWatchlist(data || [])
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) throw signUpError

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          user_id: data.user.id,
          username,
          email,
        },
      ])

      if (profileError) throw profileError
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const addToWatchlist = async (animeId: number, status: WatchlistItem['status']) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('watchlist')
      .insert([
        {
          user_id: user.user_id,
          anime_id: animeId,
          status,
        },
      ])
      .select()
      .single()

    if (error) throw error
    setWatchlist((prev) => [...prev, data])
  }

  const updateWatchlistStatus = async (watchlistId: number, status: WatchlistItem['status']) => {
    const { error } = await supabase
      .from('watchlist')
      .update({ status })
      .eq('id', watchlistId)

    if (error) throw error
    setWatchlist((prev) =>
      prev.map((item) => (item.id === watchlistId ? { ...item, status } : item))
    )
  }

  const removeFromWatchlist = async (watchlistId: number) => {
    const { error } = await supabase.from('watchlist').delete().eq('id', watchlistId)

    if (error) throw error
    setWatchlist((prev) => prev.filter((item) => item.id !== watchlistId))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        watchlist,
        signIn,
        signUp,
        signOut,
        addToWatchlist,
        updateWatchlistStatus,
        removeFromWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
