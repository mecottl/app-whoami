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
        // Los poolers gestionados (Supabase, Neon…) exigen TLS pero presentan
        // un certificado que no valida contra las CA del sistema.
        ssl: isLocal ? undefined : { rejectUnauthorized: false },
      }),
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
