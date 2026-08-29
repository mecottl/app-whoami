import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { SearchResult } from '../search-result.js'

@Injectable()
export class OpenLibraryProvider {
  constructor(private http: HttpService) {}

  async search(query: string): Promise<SearchResult[]> {
    const url =
      'https://openlibrary.org/search.json' +
      `?q=${encodeURIComponent(query)}&limit=8&fields=key,title,author_name,cover_i`

    const res = await firstValueFrom(this.http.get(url))

    return (res.data.docs ?? [])
      .filter((d: any) => d.cover_i)
      .map((d: any) => ({
        id: String(d.key ?? d.cover_i),
        title: d.author_name?.[0] ? `${d.title} - ${d.author_name[0]}` : d.title,
        imageUrl: `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`,
      }))
  }
}
