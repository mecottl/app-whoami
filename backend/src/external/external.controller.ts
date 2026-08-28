import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { ExternalService } from './external.service.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'

@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query('type') type: string, @Query('q') q: string) {
    if (!q?.trim()) return []
    return this.externalService.search(type, q.trim())
  }

  // Sin guard: se consume desde <img src> y desde el exportador de imagen.
  @Get('img')
  async image(@Query('url') url: string, @Res() res: Response) {
    const { data, contentType } = await this.externalService.proxyImage(url)
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    })
    res.send(data)
  }
}
