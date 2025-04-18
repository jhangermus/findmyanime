"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useLocalWatchlist } from "@/context/local-watchlist-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, CheckCircle, ListPlus } from "lucide-react"
import Link from "next/link"

interface AddToWatchlistButtonProps {
  animeId: string
}

export function AddToWatchlistButton({ animeId }: AddToWatchlistButtonProps) {
  const { user, watchlist: userWatchlist, addToWatchlist: addToUserWatchlist } = useAuth()
  const { watchlist: localWatchlist, addToWatchlist: addToLocalWatchlist } = useLocalWatchlist()
  const [isLoading, setIsLoading] = useState(false)

  const isInWatchlist = user
    ? userWatchlist.some((item) => item.anime_id === animeId)
    : localWatchlist.some((item) => item.anime_id === animeId)

  const handleAddToWatchlist = async (status: 'watching' | 'completed' | 'planning' | 'dropped') => {
    try {
      setIsLoading(true)
      if (user) {
        await addToUserWatchlist(animeId, status)
      } else {
        addToLocalWatchlist(animeId, status)
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Link href="/auth">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          <ListPlus className="h-4 w-4 mr-2" />
          Sign in to add to watchlist
        </Button>
      </Link>
    )
  }

  if (isInWatchlist) {
    return (
      <Button variant="outline" size="sm" className="w-full" disabled>
        <CheckCircle className="h-4 w-4 mr-2" />
        In your watchlist
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full" disabled={isLoading}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add to watchlist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleAddToWatchlist('watching')}>
          Currently Watching
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToWatchlist('completed')}>
          Completed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToWatchlist('planning')}>
          Plan to Watch
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToWatchlist('dropped')}>
          Dropped
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
