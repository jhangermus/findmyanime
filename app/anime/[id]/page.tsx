"use client"

import { useEffect, useState } from 'react'
import { getAnimeById, type Anime } from '@/lib/anilist'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StarIcon } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

export default function AnimePage({ params }: { params: { id: string } }) {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAnimeById(parseInt(params.id))
        setAnime(data)
      } catch (err) {
        setError('Error al cargar el anime')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <Card className="w-full h-[600px] animate-pulse bg-slate-800 border-slate-700">
            <CardContent className="p-0 h-full bg-slate-700" />
          </Card>
        </div>
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <Card className="w-full border-slate-800 bg-slate-900">
            <CardContent className="p-6 text-center text-slate-400">
              {error || 'No se pudo cargar el anime'}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        <Card className="w-full border-slate-800 bg-slate-900 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Banner/Cover Image */}
              <div className="relative w-full h-[500px]">
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
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Imagen de portada */}
                  <div className="relative w-48 h-72 shrink-0">
                    <Image
                      src={anime.coverImage.large}
                      alt={anime.title.english || anime.title.romaji}
                      fill
                      className="object-cover rounded-lg ring-2 ring-slate-800"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-yellow-500 text-black px-3 py-1">
                        <StarIcon className="w-4 h-4 mr-1" />
                        {(anime.averageScore / 10).toFixed(1)}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {anime.episodes} episodios
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {anime.status}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {anime.seasonYear}
                      </Badge>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-2">
                      {anime.title.english || anime.title.romaji}
                    </h1>
                    <h2 className="text-xl text-slate-400 mb-6">
                      {anime.title.native}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {anime.genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant="outline"
                          className="border-purple-700 text-purple-300"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-slate-300 mb-6 leading-relaxed"
                       dangerouslySetInnerHTML={{ __html: anime.description || 'No hay descripción disponible.' }}>
                    </p>

                    {user && (
                      <div className="flex gap-4">
                        <Button
                          onClick={() => {}} // TODO: Implementar addToWatchlist
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Añadir a Planificados
                        </Button>
                        <Button
                          onClick={() => {}} // TODO: Implementar addToWatchlist
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Empezar a Ver
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 