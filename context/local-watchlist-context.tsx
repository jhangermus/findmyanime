"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import type { WatchlistItem } from '@/lib/supabase'
import type { AnimeData } from '@/types/anime'

interface LocalWatchlistContextType {
  watchlist: WatchlistItem[]
  addToWatchlist: (animeId: number, status: WatchlistItem['status']) => void
  removeFromWatchlist: (animeId: number) => void
  updateWatchlistStatus: (animeId: number, status: WatchlistItem['status']) => void
  migrateToUserAccount?: (userId: string) => Promise<void>
}

const LocalWatchlistContext = createContext<LocalWatchlistContextType | undefined>(undefined)

export function LocalWatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('localWatchlist')
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('localWatchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (animeId: number, status: WatchlistItem['status']) => {
    const newItem: WatchlistItem = {
      id: Date.now(),
      user_id: 'local',
      anime_id: animeId,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setWatchlist((prev) => [...prev, newItem])
  }

  const removeFromWatchlist = (animeId: number) => {
    setWatchlist((prev) => prev.filter((item) => item.anime_id !== animeId))
  }

  const updateWatchlistStatus = (animeId: number, status: WatchlistItem['status']) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.anime_id === animeId
          ? { ...item, status, updated_at: new Date().toISOString() }
          : item
      )
    )
  }

  const migrateToUserAccount = async (userId: string) => {
    // This function would be implemented when the user decides to create an account
    // It would migrate the local watchlist to their new account
    console.log('Migrating watchlist to user account:', userId)
  }

  return (
    <LocalWatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        updateWatchlistStatus,
        migrateToUserAccount,
      }}
    >
      {children}
    </LocalWatchlistContext.Provider>
  )
}

export function useLocalWatchlist() {
  const context = useContext(LocalWatchlistContext)
  if (context === undefined) {
    throw new Error('useLocalWatchlist must be used within a LocalWatchlistProvider')
  }
  return context
} 