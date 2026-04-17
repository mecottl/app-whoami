import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'
import { env } from 'node:process'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  })

  app.use((req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-store')
    next()
  })

  await app.listen(process.env.PORT || 3000)
}

bootstrap()