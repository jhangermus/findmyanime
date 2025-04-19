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

export async function getPopularAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(page: 1, perPage: 20) {
        media(type: ANIME, sort: POPULARITY_DESC) {
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
    body: JSON.stringify({ query })
  })

  const json = await response.json()
  return json.data.Page.media
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