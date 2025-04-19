"use client"

import { useEffect, useState } from "react"
import { getPopularAnime, type Anime } from "@/lib/anilist"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon, ExternalLink, BookmarkPlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getCrunchyrollUrl } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export default function AnimeDaily() {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        const { animes } = await getPopularAnime(1, 50)
        // Select a random anime from the first 50
        const randomAnime = animes[Math.floor(Math.random() * animes.length)]
        setAnime(randomAnime)
      } catch (err) {
        setError("Error loading daily anime")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomAnime()
  }, [])

  if (loading) {
    return (
      <Card className="w-full h-[400px] animate-pulse bg-slate-800 border-slate-700">
        <CardContent className="p-0 h-full bg-slate-700" />
      </Card>
    )
  }

  if (error || !anime) {
    return (
      <Card className="w-full border-slate-800 bg-slate-900">
        <CardContent className="p-6 text-center text-slate-400">
          {error || "Could not load daily anime"}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-slate-800 bg-slate-900 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Banner/Cover Image */}
          <div className="relative w-full h-[400px]">
            <Image
              src={anime.coverImage.large}
              alt={anime.title.english || anime.title.romaji}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm">
                    Anime of the Day
                  </Badge>
                  <Badge className="bg-yellow-500 text-black px-3 py-1 text-sm font-medium">
                    <StarIcon className="w-4 h-4 mr-1" />
                    {(anime.averageScore / 10).toFixed(1)}
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {anime.title.english || anime.title.romaji}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-700 px-3 py-1">
                    {anime.episodes} episodes
                  </Badge>
                  <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-700 px-3 py-1">
                    {anime.seasonYear}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres.map((genre) => (
                    <Badge
                      key={genre}
                      className="bg-purple-600/20 text-purple-200 hover:bg-purple-600/30 px-3 py-1"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-slate-300 line-clamp-3 mb-4"
                   dangerouslySetInnerHTML={{ __html: anime.description || "No description available." }}>
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <Link href={`/anime/${anime.id}`} className="flex-1">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 bg-orange-600/20 text-orange-100 hover:bg-orange-600/30 border-orange-500/50 hover:border-orange-500 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                    onClick={() => window.open(getCrunchyrollUrl(anime.title.romaji), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Watch on Crunchyroll
                  </Button>
                  <Button
                    onClick={() => {
                      if (!user) {
                        window.location.href = '/login'
                        return
                      }
                      // TODO: Implement addToWatchlist
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
