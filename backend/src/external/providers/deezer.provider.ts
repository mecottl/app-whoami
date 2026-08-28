import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { SearchResult } from '../search-result.js'

@Injectable()
export class DeezerProvider {
  constructor(private http: HttpService) {}

  async search(query: string): Promise<SearchResult[]> {
    const url = `https://api.deezer.com/search/album?q=${encodeURIComponent(query)}`
    const res = await firstValueFrom(this.http.get(url))

    return (res.data.data ?? []).slice(0, 8).map((a: any) => ({
      id: a.id.toString(),
      title: a.artist?.name ? `${a.title} — ${a.artist.name}` : a.title,
      imageUrl: a.cover_medium ?? null,
    }))
  }
}
