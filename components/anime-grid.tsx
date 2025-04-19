"use client"

import { useEffect, useState } from 'react'
import { getPopularAnime, type Anime } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, BookmarkPlus } from "lucide-react"
import type { AnimeData } from "@/types/anime"
import { useAuth } from '@/context/auth-context'

interface AnimeGridProps {
  filters: {
    genres: string[]
    minEpisodes: number
    maxEpisodes: number
  }
}

interface PageInfo {
  total: number
  currentPage: number
  lastPage: number
  hasNextPage: boolean
  perPage: number
}

const DESIRED_VISIBLE_COUNT = 50

export default function AnimeGrid({ filters }: AnimeGridProps) {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isAutoLoading, setIsAutoLoading] = useState(false)
  const { user } = useAuth()

  const fetchAnimes = async (page: number) => {
    try {
      const data = await getPopularAnime(page, 50)
      return {
        newAnimes: data.animes as Anime[],
        newPageInfo: data.pageInfo
      }
    } catch (err) {
      console.error('Error fetching animes:', err)
      throw err
    }
  }

  useEffect(() => {
    const initializeAnimes = async () => {
      try {
        setLoading(true)
        const { newAnimes, newPageInfo } = await fetchAnimes(1)
        setAnimes(newAnimes)
        setFilteredAnimes(newAnimes)
        setPageInfo(newPageInfo)
      } catch (err) {
        setError('Error al cargar los animes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    initializeAnimes()
  }, [])

  const loadMoreAnimes = async () => {
    if (!pageInfo?.hasNextPage || loadingMore) return

    try {
      setLoadingMore(true)
      const nextPage = currentPage + 1
      const { newAnimes, newPageInfo } = await fetchAnimes(nextPage)
      
      setAnimes(prev => [...prev, ...newAnimes])
      setPageInfo(newPageInfo)
      setCurrentPage(nextPage)
    } catch (err) {
      console.error('Error loading more animes:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const autoLoadMoreIfNeeded = async (filteredCount: number) => {
    if (isAutoLoading || !pageInfo?.hasNextPage) return
    
    const needsMore = filteredCount < DESIRED_VISIBLE_COUNT
    if (needsMore) {
      setIsAutoLoading(true)
      try {
        await loadMoreAnimes()
      } finally {
        setIsAutoLoading(false)
      }
    }
  }

  useEffect(() => {
    const filterAnimes = async () => {
      const filtered = animes.filter(anime => {
        // Filtrar por géneros si hay géneros seleccionados
        if (filters.genres.length > 0) {
          // Verificar que el anime tenga TODOS los géneros seleccionados
          const hasAllSelectedGenres = filters.genres.every(selectedGenre =>
            anime.genres.includes(selectedGenre)
          )
          if (!hasAllSelectedGenres) return false
        }

        // Filtrar por número de episodios
        if (anime.episodes) {
          if (filters.minEpisodes > 0 && anime.episodes < filters.minEpisodes) return false
          if (filters.maxEpisodes < 100 && anime.episodes > filters.maxEpisodes) return false
        }

        return true
      })

      setFilteredAnimes(filtered)

      // Si después de filtrar quedan menos animes de los deseados, cargar más
      if (filtered.length < DESIRED_VISIBLE_COUNT) {
        autoLoadMoreIfNeeded(filtered.length)
      }
    }

    filterAnimes()
  }, [filters, animes])

  if (loading) return <div className="text-center text-slate-400">Cargando animes...</div>
  if (error) return <div className="text-center text-red-400">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Anime List</h2>
        <div className="text-slate-400">
          Showing {filteredAnimes.length} results
          {filters.genres.length > 0 && (
            <span className="ml-2 text-sm">
              (filtered by {filters.genres.join(" + ")})
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimes.map((anime) => (
          <div key={anime.id} className="bg-slate-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500/50 transition-all">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-bold">
                ★ {(anime.averageScore / 10).toFixed(1)}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-lg font-semibold text-slate-200 line-clamp-1 mb-2">
                {anime.title.english || anime.title.romaji}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {anime.genres.slice(0, 3).map(genre => (
                  <span 
                    key={genre} 
                    className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-2"
                 dangerouslySetInnerHTML={{ __html: anime.description || 'No description available' }}>
              </p>
              <div className="text-sm text-slate-500 mb-3">
                {anime.episodes} episodios • {anime.seasonYear}
              </div>
              <div className="flex w-full space-x-2">
                <Button 
                  asChild
                  className="h-8 flex-1 min-w-0 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs"
                >
                  <Link href={`/anime/${anime.id}`} className="px-2 w-full truncate flex items-center justify-center">
                    View Details
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    if (!user) {
                      window.location.href = '/login'
                      return
                    }
                    // TODO: Implement addToWatchlist
                  }}
                  className="h-8 flex-1 min-w-0 bg-[#9333ea] hover:bg-[#7e22ce] text-white text-xs px-2"
                >
                  <div className="w-full truncate flex items-center justify-center gap-1">
                    <BookmarkPlus className="w-3 h-3 shrink-0" />
                    Add to Watchlist
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnimes.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2 text-white">No anime found</h3>
          <p className="text-slate-400">Try adjusting your filters to find something to watch</p>
        </div>
      )}

      {pageInfo?.hasNextPage && filteredAnimes.length >= DESIRED_VISIBLE_COUNT && (
        <div className="mt-8 text-center">
          <Button
            onClick={loadMoreAnimes}
            disabled={loadingMore || isAutoLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loadingMore || isAutoLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
