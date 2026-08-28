import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { SearchResult } from '../search-result.js'

@Injectable()
export class RawgProvider {
  private apiKey = process.env.RAWG_API_KEY
  private baseUrl = 'https://api.rawg.io/api'

  constructor(private http: HttpService) {}

  async search(query: string): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        'Búsqueda de juegos no configurada (falta RAWG_API_KEY)',
      )
    }

    const url = `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=8`
    const res = await firstValueFrom(this.http.get(url))

    return (res.data.results ?? []).map((g: any) => ({
      id: g.id.toString(),
      title: g.name,
      imageUrl: g.background_image ?? null,
    }))
  }
}
