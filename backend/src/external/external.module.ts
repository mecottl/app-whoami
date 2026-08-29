import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ExternalService } from './external.service.js'
import { ExternalController } from './external.controller.js'
import { TmdbProvider } from './providers/tmdb.provider.js'
import { DeezerProvider } from './providers/deezer.provider.js'
import { RawgProvider } from './providers/rawg.provider.js'
import { SportsDbProvider } from './providers/sportsdb.provider.js'
import { OpenLibraryProvider } from './providers/openlibrary.provider.js'

@Module({
  imports: [HttpModule],
  controllers: [ExternalController],
  providers: [
    ExternalService,
    TmdbProvider,
    DeezerProvider,
    RawgProvider,
    SportsDbProvider,
    OpenLibraryProvider,
  ],
})
export class ExternalModule {}
