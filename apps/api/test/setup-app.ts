import { Test } from '@nestjs/testing'
import type { TestingModuleBuilder } from '@nestjs/testing'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

// Reproduit le bootstrap réel de main.ts (préfixe, pipes, filtres, intercepteurs)
// pour que les tests e2e passent par exactement le même pipeline HTTP qu'en production.
export async function createTestApp(
  configure?: (builder: TestingModuleBuilder) => void,
): Promise<INestApplication> {
  const builder = Test.createTestingModule({ imports: [AppModule] })
  configure?.(builder)

  const moduleRef = await builder.compile()
  const app = moduleRef.createNestApplication()

  app.setGlobalPrefix('api/v1', { exclude: ['api/health'] })
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

  await app.init()
  return app
}
