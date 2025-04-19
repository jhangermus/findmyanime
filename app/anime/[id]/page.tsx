"use client"

import { useEffect, useState } from 'react'
import { getAnimeFromCache } from '@/lib/anime-cache'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/context/auth-context'
import { Badge } from "@/components/ui/badge"
import { BookmarkPlus, Star, Calendar, Clock, PlayCircle, ExternalLink } from "lucide-react"
import type { Anime } from '@/lib/anilist'
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'
import { YoutubeIcon } from 'lucide-react'
import { getCrunchyrollUrl } from '@/lib/utils'

export default function AnimePage({ params }: { params: { id: string } }) {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAnimeFromCache(parseInt(params.id))
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
      <div className="min-h-screen bg-[#0B0D14]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Skeleton className="w-full aspect-[3/4] rounded-lg bg-[#1A1D27]" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4 mb-4 bg-[#1A1D27]" />
              <Skeleton className="h-4 w-1/4 mb-2 bg-[#1A1D27]" />
              <Skeleton className="h-24 w-full mb-4 bg-[#1A1D27]" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20 bg-[#1A1D27]" />
                <Skeleton className="h-6 w-20 bg-[#1A1D27]" />
                <Skeleton className="h-6 w-20 bg-[#1A1D27]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#0B0D14]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-slate-400">{error || 'No se pudo encontrar el anime'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0D14]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna Izquierda - Imagen y Datos Rápidos */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-8">
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-4 ring-1 ring-[#1A1D27]">
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.english || anime.title.romaji}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="bg-[#1A1D27] rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg font-semibold text-yellow-500">
                      {(anime.averageScore / 10).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#A175FF]" />
                    <span className="text-lg font-semibold text-[#A175FF]">
                      {anime.episodes || '?'} eps
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span>{anime.season} {anime.seasonYear}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <PlayCircle className="w-4 h-4" />
                    <span>{anime.status}</span>
                  </div>
                  <a
                    href={getCrunchyrollUrl(anime.title.english || anime.title.romaji)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#A175FF] hover:text-[#8257FE] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Watch on Crunchyroll</span>
                  </a>
                </div>

                <Button
                  onClick={() => {
                    if (!user) {
                      window.location.href = '/login'
                      return
                    }
                    // TODO: Implement addToWatchlist
                  }}
                  className="w-full bg-[#A175FF] hover:bg-[#8257FE] text-white"
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Agregar a Watchlist
                </Button>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Información Principal */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {anime.title.english || anime.title.romaji}
            </h1>
            
            {anime.title.native && (
              <h2 className="text-xl text-slate-400 mb-4">
                {anime.title.native}
              </h2>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map(genre => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-[#1A1D27] text-[#A175FF] hover:bg-[#252836]"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <div
                dangerouslySetInnerHTML={{ __html: anime.description || 'No hay descripción disponible.' }}
                className="text-slate-300 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#1A1D27] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Información</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Estado</dt>
                    <dd className="text-slate-200">{anime.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Temporada</dt>
                    <dd className="text-slate-200">{anime.season} {anime.seasonYear}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Episodios</dt>
                    <dd className="text-slate-200">{anime.episodes || 'Desconocido'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Puntuación</dt>
                    <dd className="text-yellow-500">{(anime.averageScore / 10).toFixed(1)} ★</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-[#1A1D27] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Títulos</h3>
                <dl className="space-y-2">
                  {anime.title.english && (
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Inglés</dt>
                      <dd className="text-slate-200">{anime.title.english}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Romaji</dt>
                    <dd className="text-slate-200">{anime.title.romaji}</dd>
                  </div>
                  {anime.title.native && (
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Nativo</dt>
                      <dd className="text-slate-200">{anime.title.native}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Trailer Section */}
            {anime.trailer && anime.trailer.site === 'youtube' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Trailer</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#1A1D27]">
                  <iframe
                    src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Characters Section */}
            {anime.characters && anime.characters.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Personajes Principales</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {anime.characters.map(character => (
                    <div key={character.id} className="bg-[#1A1D27] rounded-lg overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={character.image.large}
                            alt={character.name.full}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-white font-medium">{character.name.full}</h4>
                          <p className="text-slate-400 text-sm">{character.name.native}</p>
                        </div>
                      </div>
                      {character.voiceActor && (
                        <div className="border-t border-[#252836] flex items-center p-4 bg-[#1A1D27]">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={character.voiceActor.image.large}
                              alt={character.voiceActor.name.full}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-slate-300 text-sm">{character.voiceActor.name.full}</p>
                            <p className="text-slate-500 text-xs">{character.voiceActor.name.native}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {anime.recommendations && anime.recommendations.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Recomendaciones</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {anime.recommendations.map(rec => (
                    <Link
                      key={rec.id}
                      href={`/anime/${rec.id}`}
                      className="group bg-[#1A1D27] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#A175FF] transition-all"
                    >
                      <div className="relative aspect-[3/4] w-full">
                        <Image
                          src={rec.coverImage.large}
                          alt={rec.title.english || rec.title.romaji}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                          ★ {(rec.averageScore / 10).toFixed(1)}
                        </div>
                      </div>
                      <div className="p-2">
                        <h4 className="text-sm font-medium text-slate-200 line-clamp-2">
                          {rec.title.english || rec.title.romaji}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 