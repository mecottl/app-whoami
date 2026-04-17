import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class DeezerProvider {
  constructor(private http: HttpService) {}

  async search(query: string) {
    const url = `https://api.deezer.com/search/album?q=${query}`

    const res = await firstValueFrom(this.http.get(url))

    return res.data.data.slice(0, 5).map((a: any) => ({
      id: a.id.toString(),
      title: a.title,
      imageUrl: a.cover_medium,
    }))
  }
}