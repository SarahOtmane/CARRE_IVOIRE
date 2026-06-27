import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

function buildLogger() {
  const isProd = process.env.NODE_ENV === 'production'
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: isProd
          ? winston.format.combine(winston.format.timestamp(), winston.format.json())
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp({ format: 'HH:mm:ss' }),
              winston.format.printf(({ level, message, timestamp, context }) =>
                `${timestamp} [${context ?? 'App'}] ${level}: ${message}`,
              ),
            ),
      }),
    ],
  })
}

function buildCorsOrigins(): string[] {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  }
  if (process.env.NODE_ENV !== 'production') {
    return [process.env.FRONTEND_URL ?? 'http://localhost:5173']
  }
  return []
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: buildLogger(),
  })

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' })

  app.setGlobalPrefix('api/v1', { exclude: ['api/health'] })

  app.enableCors({
    origin: buildCorsOrigins(),
    credentials: true,
  })

  app.use(helmet())
  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Carré Ivoire API')
      .setDescription('API REST de la plateforme e-commerce Carré Ivoire')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  }

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
