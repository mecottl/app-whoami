import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { SearchResult } from '../search-result.js'

const QUERY = `
query ($q: String) {
  Page(perPage: 8) {
    media(search: $q, type: ANIME, sort: SEARCH_MATCH) {
      id
      title { english romaji }
      coverImage { large medium }
    }
  }
}`

@Injectable()
export class AniListProvider {
  constructor(private http: HttpService) {}

  async search(query: string): Promise<SearchResult[]> {
    try {
      const res = await firstValueFrom(
        this.http.post(
          'https://graphql.anilist.co',
          { query: QUERY, variables: { q: query } },
          { timeout: 8000, headers: { 'Content-Type': 'application/json' } },
        ),
      )

      const media = res.data?.data?.Page?.media ?? []
      return media.map((m: any) => ({
        id: String(m.id),
        title: m.title?.english || m.title?.romaji || 'Anime',
        imageUrl: m.coverImage?.large ?? m.coverImage?.medium ?? null,
      }))
    } catch {
      throw new ServiceUnavailableException(
        'La búsqueda de anime no responde ahora mismo. Inténtalo de nuevo.',
      )
    }
  }
}
