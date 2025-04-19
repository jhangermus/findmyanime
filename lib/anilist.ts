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

export async function getAnimeById(id: number): Promise<Anime> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
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
        siteUrl
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
      variables: { id }
    })
  })

  const json = await response.json()
  return json.data.Media
} 