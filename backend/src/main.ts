import 'dotenv/config'

import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe, Logger } from '@nestjs/common'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  })

  app.use((_req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-store')
    next()
  })

  app.enableShutdownHooks()

  const port = process.env.PORT || 3000
  await app.listen(port)
  new Logger('Bootstrap').log(`API escuchando en http://localhost:${port}`)
}

bootstrap()
