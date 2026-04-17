import { Module } from '@nestjs/common'
import { ExternalService } from './external.service.js'
import { ExternalController } from './external.controller.js'
import { TmdbProvider } from './providers/tmdb.provider.js'
import { DeezerProvider } from './providers/deezer.provider.js'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [ExternalController],
  providers: [ExternalService, TmdbProvider, DeezerProvider],
})
export class ExternalModule {}