"use client"

import { useEffect, useState } from 'react'
import { getPopularAnime, type Anime } from '@/lib/anilist'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function PopularAnime() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const data = await getPopularAnime()
        setAnimes(data)
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
        <Card key={anime.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
          <CardHeader>
            <CardTitle className="line-clamp-1 text-slate-200">
              {anime.title.english || anime.title.romaji}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full aspect-[3/4]">
              <Image
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-slate-400 line-clamp-3" 
               dangerouslySetInnerHTML={{ __html: anime.description || 'No description available' }}>
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/anime/${anime.id}`} className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Ver detalles</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 