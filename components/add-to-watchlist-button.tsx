"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useLocalWatchlist } from '@/context/local-watchlist-context'
import { toast } from 'sonner'
import type { WatchlistItem } from '@/lib/supabase'

interface AddToWatchlistButtonProps {
  animeId: number
  title: string
}

export function AddToWatchlistButton({ animeId, title }: AddToWatchlistButtonProps) {
  const { user, watchlist, addToWatchlist: addToUserWatchlist } = useAuth()
  const { addToWatchlist: addToLocalWatchlist } = useLocalWatchlist()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToWatchlist = async (status: WatchlistItem['status']) => {
    try {
      setIsLoading(true)

      if (user) {
        await addToUserWatchlist(animeId, status)
        toast.success(`${title} added to your watchlist`)
      } else {
        addToLocalWatchlist(animeId, status)
        toast.success(
          `${title} added to your temporary watchlist. Create an account to save it permanently!`
        )
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      toast.error('Failed to add to watchlist')
    } finally {
      setIsLoading(false)
    }
  }

  const isInWatchlist = user
    ? watchlist.some((item) => item.anime_id === animeId)
    : false

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={isLoading || isInWatchlist}
      onClick={() => handleAddToWatchlist('PLANNING')}
    >
      {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </Button>
  )
}
