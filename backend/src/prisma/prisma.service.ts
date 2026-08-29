import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const url = process.env.DATABASE_URL as string
    const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url)

    super({
      adapter: new PrismaPg({
        connectionString: url,
        // Poolers gestionados (Supabase, Neon…) exigen TLS con un certificado
        // que no valida contra las CA del sistema. En local no se toca.
        ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
      }),
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
