import { BadRequestException, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { TmdbProvider } from './providers/tmdb.provider.js'
import { DeezerProvider } from './providers/deezer.provider.js'
import { RawgProvider } from './providers/rawg.provider.js'
import { SportsDbProvider } from './providers/sportsdb.provider.js'
import type { SearchResult } from './search-result.js'

const ALLOWED_IMAGE_HOSTS = [
  'image.tmdb.org',
  'cdn-images.dzcdn.net',
  'e-cdns-images.dzcdn.net',
  'media.rawg.io',
  'r2.thesportsdb.com',
  'www.thesportsdb.com',
]

export type SearchableType = 'MOVIE' | 'SERIES' | 'MUSIC' | 'GAME' | 'SPORT'

@Injectable()
export class ExternalService {
  constructor(
    private tmdb: TmdbProvider,
    private deezer: DeezerProvider,
    private rawg: RawgProvider,
    private sportsdb: SportsDbProvider,
    private http: HttpService,
  ) {}

  search(type: string, query: string): Promise<SearchResult[]> {
    switch (type) {
      case 'MOVIE':
        return this.tmdb.searchMovies(query)
      case 'SERIES':
        return this.tmdb.searchSeries(query)
      case 'MUSIC':
        return this.deezer.search(query)
      case 'GAME':
        return this.rawg.search(query)
      case 'SPORT':
        return this.sportsdb.search(query)
      default:
        throw new BadRequestException(`Tipo de búsqueda no soportado: ${type}`)
    }
  }

  /** Proxy de imágenes: evita problemas de CORS al mostrar y exportar la card. */
  async proxyImage(rawUrl: string): Promise<{ data: Buffer; contentType: string }> {
    let url: URL
    try {
      url = new URL(rawUrl)
    } catch {
      throw new BadRequestException('URL inválida')
    }

    if (url.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.includes(url.hostname)) {
      throw new BadRequestException('Host no permitido')
    }

    const res = await firstValueFrom(
      this.http.get<ArrayBuffer>(url.toString(), { responseType: 'arraybuffer' }),
    )

    return {
      data: Buffer.from(res.data),
      contentType: res.headers['content-type'] ?? 'image/jpeg',
    }
  }
}
