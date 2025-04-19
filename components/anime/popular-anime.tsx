"use client"

import { useEffect, useState } from 'react'
import { getPopularAnime, type Anime } from '@/lib/anilist'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookmarkPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'

export function PopularAnime() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const { animes: popularAnimes } = await getPopularAnime()
        setAnimes(popularAnimes)
      } catch (err) {
        setError('Error al cargar los animes populares')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimes()
  }, [])

  if (loading) return <div className="text-slate-400">Cargando animes populares...</div>
  if (error) return <div className="text-red-400">{error}</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {animes.map((anime) => (
        <Card key={anime.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-slate-200">
              {anime.title.english || anime.title.romaji}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <div className="relative w-full aspect-[3/4] mb-4">
              <Image
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm text-slate-400 line-clamp-3" 
               dangerouslySetInnerHTML={{ __html: anime.description || 'No description available' }}>
            </p>
          </CardContent>
          <CardFooter className="flex gap-2 p-4 pt-0">
            <Link href={`/anime/${anime.id}`} className="flex-1">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30">
                View Details
              </Button>
            </Link>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 