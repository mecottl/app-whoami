import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class TmdbProvider {
  private apiKey = process.env.TMDB_API_KEY
  private baseUrl = 'https://api.themoviedb.org/3'

  constructor(private http: HttpService) {}

  async search(query: string) {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`

    const res = await firstValueFrom(this.http.get(url))

    return res.data.results.slice(0, 5).map((m: any) => ({
      id: m.id.toString(),
      title: m.title,
      imageUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
    }))
  }
}