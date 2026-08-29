import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    let url = process.env.DATABASE_URL as string
    const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url)

    let ssl: { rejectUnauthorized: boolean } | undefined
    if (!isLocal) {
      // `pg` v8 trata sslmode=require como verify-full, y el certificado del
      // pooler de Supabase/Neon es self-signed -> fallaría. Quitamos el
      // parámetro de la URL y controlamos el TLS aquí.
      try {
        const u = new URL(url)
        u.searchParams.delete('sslmode')
        url = u.toString()
      } catch {
        /* URL rara: la dejamos tal cual */
      }
      ssl = { rejectUnauthorized: false }
    }

    super({
      adapter: new PrismaPg({ connectionString: url, ...(ssl ? { ssl } : {}) }),
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      await this.$queryRaw`SELECT 1`
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PrismaService] no se pudo conectar a la base:', err)
      throw err
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
