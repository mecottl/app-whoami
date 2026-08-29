import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { SearchResult } from '../search-result.js'

@Injectable()
export class TmdbProvider {
  private apiKey = process.env.TMDB_API_KEY
  private baseUrl = 'https://api.themoviedb.org/3'

  constructor(private http: HttpService) {}

  searchMovies(query: string) {
    return this.query('/search/movie', query, (m) => m.title)
  }

  searchSeries(query: string) {
    return this.query('/search/tv', query, (m) => m.name)
  }

  private async query(
    path: string,
    query: string,
    title: (m: any) => string,
  ): Promise<SearchResult[]> {
    if (!this.apiKey) return []
    const url = `${this.baseUrl}${path}?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
    const res = await firstValueFrom(this.http.get(url))

    return (res.data.results ?? []).slice(0, 8).map((m: any) => ({
      id: m.id.toString(),
      title: title(m),
      imageUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
    }))
  }
}
