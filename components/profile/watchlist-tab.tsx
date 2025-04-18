"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import { getUserWatchlist, removeFromWatchlist } from "@/actions/watchlist-actions"
import { useAuth } from "@/context/auth-context"
import type { AnimeData } from "@/types/anime"

export default function WatchlistTab() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<AnimeData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWatchlist() {
      if (user?.id) {
        setIsLoading(true)
        try {
          const data = await getUserWatchlist(user.id)
          setWatchlist(data)
        } catch (error) {
          console.error("Error fetching watchlist:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchWatchlist()
  }, [user?.id])

  const handleRemoveFromWatchlist = async (animeId: string) => {
    if (!user?.id) return

    try {
      await removeFromWatchlist(user.id, animeId)
      setWatchlist(watchlist.filter((anime) => anime.id !== animeId))
    } catch (error) {
      console.error("Error removing from watchlist:", error)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardContent className="p-6">
          <p className="text-center py-8">Loading your watchlist...</p>
        </CardContent>
      </Card>
    )
  }

  if (watchlist.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2 text-white">Your watchlist is empty</h3>
            <p className="text-slate-400 mb-4">Add anime to your watchlist to see them here</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => (window.location.href = "/")}>
              Explore anime
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchlist.map((anime) => (
            <div key={anime.id} className="flex bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              <div className="w-24 h-32 relative flex-shrink-0">
                <Image src={anime.image || "/placeholder.svg"} alt={anime.title} fill className="object-cover" />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-white line-clamp-1">{anime.title}</h3>
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-xs text-slate-300">{anime.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 my-1">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs border-slate-700 text-slate-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {anime.episodes} episodes • {anime.year}
                </div>
                <div className="mt-auto pt-2 flex justify-between items-center">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs h-8">
                    Watch Now
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                    onClick={() => handleRemoveFromWatchlist(anime.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
