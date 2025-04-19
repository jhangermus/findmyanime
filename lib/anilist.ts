const ANILIST_API_URL = 'https://graphql.anilist.co'

export interface Anime {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage: {
    large: string
    medium: string
  }
  description: string
  episodes: number
  status: string
  averageScore: number
  genres: string[]
  seasonYear: number
  season: string
  siteUrl: string
  trailer?: {
    id: string
    site: string
    thumbnail: string
  }
  characters?: {
    id: number
    name: {
      full: string
      native: string
    }
    image: {
      large: string
    }
    voiceActor?: {
      id: number
      name: {
        full: string
        native: string
      }
      image: {
        large: string
      }
    }
  }[]
  recommendations?: {
    id: number
    title: {
      romaji: string
      english: string
    }
    coverImage: {
      large: string
    }
    averageScore: number
  }[]
}

export async function searchAnime(search: string): Promise<Anime[]> {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          description
          episodes
          status
          averageScore
          genres
          seasonYear
          season
        }
      }
    }
  `

  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { search }
    })
  })

  const json = await response.json()
  return json.data.Page.media
}

export async function getPopularAnime(page: number = 1, perPage: number = 50) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            large
            medium
          }
          bannerImage
          episodes
          status
          seasonYear
          averageScore
          genres
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `

  const variables = {
    page,
    perPage
  }

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    const { data } = await response.json()
    return {
      animes: data.Page.media,
      pageInfo: data.Page.pageInfo
    }
  } catch (error) {
    console.error('Error fetching popular anime:', error)
    throw error
  }
}

export const getAnimeById = async (id: number): Promise<Anime | null> => {
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        trailer {
          id
          site
          thumbnail
        }
        averageScore
        episodes
        status
        season
        seasonYear
        genres
        siteUrl
        characters(sort: ROLE, role: MAIN, page: 1, perPage: 6) {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE) {
              id
              name {
                full
                native
              }
              image {
                large
              }
            }
          }
        }
        recommendations(sort: RATING_DESC, page: 1, perPage: 4) {
          edges {
            node {
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { id }
      })
    })

    const { data } = await response.json()
    if (!data?.Media) return null

    return {
      id: data.Media.id,
      title: data.Media.title,
      description: data.Media.description,
      coverImage: data.Media.coverImage,
      trailer: data.Media.trailer,
      averageScore: data.Media.averageScore,
      episodes: data.Media.episodes,
      status: data.Media.status,
      season: data.Media.season,
      seasonYear: data.Media.seasonYear,
      genres: data.Media.genres,
      siteUrl: data.Media.siteUrl,
      characters: data.Media.characters.edges.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        image: edge.node.image,
        voiceActor: edge.voiceActors[0] || null
      })),
      recommendations: data.Media.recommendations.edges.map((edge: any) => ({
        id: edge.node.mediaRecommendation.id,
        title: edge.node.mediaRecommendation.title,
        coverImage: edge.node.mediaRecommendation.coverImage,
        averageScore: edge.node.mediaRecommendation.averageScore
      }))
    }
  } catch (error) {
    console.error('Error fetching anime:', error)
    return null
  }
} 