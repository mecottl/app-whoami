import { Controller, Get, Query } from '@nestjs/common'
import { ExternalService } from './external.service.js'

@Controller('external')
export class ExternalController {
    constructor(private readonly externalService: ExternalService) { }

    @Get('movies/search')
    searchMovies(@Query('q') q: string) {
        if (!q) return []
        return this.externalService.searchMovies(q)
    }

    @Get('albums/search')
    searchAlbums(@Query('q') q: string) {
        if (!q) return []
        return this.externalService.searchAlbums(q)
    }
}