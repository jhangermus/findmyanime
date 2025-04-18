"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { StarIcon } from "lucide-react"
import type { AnimeData } from "@/types/anime"

interface AnimeGridProps {
  initialAnimeList: AnimeData[]
}

export default function AnimeGrid({ initialAnimeList }: AnimeGridProps) {
  const [animeList, setAnimeList] = useState<AnimeData[]>(initialAnimeList)
  const [isLoading, setIsLoading] = useState(false)

  // This would be replaced with actual filter logic
  useEffect(() => {
    setAnimeList(initialAnimeList)
  }, [initialAnimeList])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Anime List</h2>
        <div className="text-slate-400">Showing {animeList.length} results</div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden h-[380px] animate-pulse bg-slate-800 border-slate-700">
              <div className="bg-slate-700 h-full"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animeList.map((anime) => (
            <Card
              key={anime.id}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-slate-900 border-slate-800"
            >
              <div className="relative h-48">
                <Image src={anime.image || "/placeholder.svg"} alt={anime.title} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white">
                    <StarIcon className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                    {anime.rating}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1 text-white">{anime.title}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {anime.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs border-slate-700 text-slate-300">
                      {genre}
                    </Badge>
                  ))}
                  {anime.genres.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">
                      +{anime.genres.length - 3}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-2 line-clamp-3">{anime.description}</p>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>{anime.episodes} episodes</span>
                  <span>{anime.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {animeList.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2 text-white">No anime found</h3>
          <p className="text-slate-400">Try adjusting your filters to find something to watch</p>
        </div>
      )}
    </div>
  )
}
