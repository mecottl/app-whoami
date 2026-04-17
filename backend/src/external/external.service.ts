import { Injectable } from '@nestjs/common'
import { TmdbProvider } from './providers/tmdb.provider.js'
import { DeezerProvider } from './providers/deezer.provider.js'

@Injectable()
export class ExternalService {
  constructor(
    private tmdb: TmdbProvider,
    private deezer: DeezerProvider,
  ) {}

  async searchMovies(query: string) {
    return this.tmdb.search(query)
  }

  async searchAlbums(query: string) {
    return this.deezer.search(query)
  }
}