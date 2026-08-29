import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

/**
 * Endpoint público de salud. Lo usa el health check de Render y el cron de
 * keep-alive (GitHub Actions) para que Supabase no pause el proyecto por
 * inactividad: cada visita ejecuta un `SELECT 1` real contra la base.
 */
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    let db = false
    try {
      await this.prisma.$queryRaw`SELECT 1`
      db = true
    } catch {
      db = false
    }
    return { ok: true, db, ts: new Date().toISOString() }
  }
}
