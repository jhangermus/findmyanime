"use client"

import { useEffect, useState } from "react"
import { getPopularAnime, type Anime } from "@/lib/anilist"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AnimeDaily() {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        const { animes } = await getPopularAnime(1, 50)
        // Seleccionar un anime aleatorio de los primeros 50
        const randomAnime = animes[Math.floor(Math.random() * animes.length)]
        setAnime(randomAnime)
      } catch (err) {
        setError("Error al cargar el anime del día")
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
          {error || "No se pudo cargar el anime del día"}
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    Anime del Día
                  </Badge>
                  <Badge className="bg-yellow-500 text-black">
                    <StarIcon className="w-4 h-4 mr-1" />
                    {(anime.averageScore / 10).toFixed(1)}
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {anime.title.english || anime.title.romaji}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    {anime.episodes} episodios
                  </Badge>
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    {anime.seasonYear}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
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
                <p className="text-slate-300 line-clamp-3 mb-4"
                   dangerouslySetInnerHTML={{ __html: anime.description || "No hay descripción disponible." }}>
                </p>
                <Link href={`/anime/${anime.id}`}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Ver más detalles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
