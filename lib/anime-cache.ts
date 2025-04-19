import { supabase } from '@/lib/supabase'
import { getAnimeById, type Anime } from '@/lib/anilist'

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos

export async function getAnimeFromCache(animeId: number): Promise<Anime | null> {
  try {
    console.log(`🔍 Buscando anime ${animeId} en caché...`)
    // Intentar obtener del caché
    const { data: cachedAnime, error: cacheError } = await supabase
      .from('anime_cache')
      .select('*')
      .eq('id', animeId)
      .single()

    if (cacheError) {
      console.error(`❌ Error accediendo al caché:`, cacheError)
      throw cacheError
    }

    // Si encontramos el anime y está actualizado, devolverlo
    if (cachedAnime) {
      const lastUpdated = new Date(cachedAnime.last_updated)
      const now = new Date()
      if (now.getTime() - lastUpdated.getTime() < CACHE_DURATION) {
        console.log(`✅ Anime ${animeId} encontrado en caché y está actualizado`)
        return transformCacheToAnime(cachedAnime)
      }
      console.log(`🕒 Anime ${animeId} encontrado en caché pero necesita actualización`)
    } else {
      console.log(`❌ Anime ${animeId} no encontrado en caché`)
    }

    // Si no está en caché o está desactualizado, obtener de AniList
    console.log(`📡 Obteniendo anime ${animeId} desde AniList...`)
    const animeData = await getAnimeById(animeId)
    if (!animeData) {
      console.log(`❌ Anime ${animeId} no encontrado en AniList`)
      return null
    }

    // Actualizar o insertar en caché
    console.log(`💾 Guardando anime ${animeId} en caché...`)
    try {
      const { error: upsertError } = await supabase
        .from('anime_cache')
        .upsert({
          id: animeData.id,
          title_english: animeData.title.english,
          title_romaji: animeData.title.romaji,
          title_native: animeData.title.native,
          description: animeData.description,
          cover_image_large: animeData.coverImage.large,
          cover_image_medium: animeData.coverImage.medium,
          average_score: animeData.averageScore,
          episodes: animeData.episodes,
          season_year: animeData.seasonYear,
          genres: animeData.genres,
          status: animeData.status,
          season: animeData.season,
          site_url: animeData.siteUrl,
          last_updated: new Date().toISOString()
        })

      if (upsertError) {
        console.error(`❌ Error guardando en caché:`, upsertError)
        throw upsertError
      }
      console.log(`✅ Anime ${animeId} guardado en caché exitosamente`)
    } catch (error) {
      console.error(`❌ Error en operación de caché:`, error)
      // Si falla el caché, aún podemos devolver los datos de AniList
    }

    return animeData
  } catch (error) {
    console.error('Error general accediendo al caché:', error)
    // Si todo falla, intentar obtener directamente de AniList
    return getAnimeById(animeId)
  }
}

export async function cachePopularAnime(animes: Anime[]): Promise<void> {
  if (!animes || animes.length === 0) {
    console.log('⚠️ No hay animes para cachear')
    return
  }

  try {
    console.log(`💾 Guardando ${animes.length} animes populares en caché...`)
    const cacheData = animes.map(anime => ({
      id: anime.id,
      title_english: anime.title.english,
      title_romaji: anime.title.romaji,
      title_native: anime.title.native,
      description: anime.description,
      cover_image_large: anime.coverImage.large,
      cover_image_medium: anime.coverImage.medium,
      average_score: anime.averageScore,
      episodes: anime.episodes,
      season_year: anime.seasonYear,
      genres: anime.genres,
      status: anime.status,
      season: anime.season,
      site_url: anime.siteUrl,
      last_updated: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('anime_cache')
      .upsert(cacheData)

    if (error) {
      console.error(`❌ Error guardando animes populares en caché:`, error)
      throw error
    }
    console.log(`✅ ${animes.length} animes populares guardados en caché exitosamente`)
  } catch (error) {
    console.error('Error general cacheando animes populares:', error)
    throw error // Re-lanzar el error para que pueda ser manejado por el componente
  }
}

function transformCacheToAnime(cachedAnime: any): Anime {
  return {
    id: cachedAnime.id,
    title: {
      english: cachedAnime.title_english,
      romaji: cachedAnime.title_romaji,
      native: cachedAnime.title_native
    },
    description: cachedAnime.description,
    coverImage: {
      large: cachedAnime.cover_image_large,
      medium: cachedAnime.cover_image_medium
    },
    averageScore: cachedAnime.average_score,
    episodes: cachedAnime.episodes,
    seasonYear: cachedAnime.season_year,
    genres: cachedAnime.genres,
    status: cachedAnime.status,
    season: cachedAnime.season,
    siteUrl: cachedAnime.site_url
  }
} 