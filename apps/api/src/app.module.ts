import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { databaseConfig } from './config/database.config'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { HealthModule } from './modules/health/health.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { ProductsModule } from './modules/products/products.module'
import { OrdersModule } from './modules/orders/orders.module'
import { TaxRatesModule } from './modules/tax-rates/tax-rates.module'
import { UploadsModule } from './modules/uploads/uploads.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { MailModule } from './modules/mail/mail.module'
import { SitemapModule } from './modules/sitemap/sitemap.module'
import { NewsletterModule } from './modules/newsletter/newsletter.module'
import { SettingsModule } from './modules/settings/settings.module'
import { envValidationSchema } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    SequelizeModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    MailModule,
    AuthModule,
    UsersModule,
    HealthModule,
    UploadsModule,
    CategoriesModule,
    TaxRatesModule,
    ProductsModule,
    OrdersModule,
    FavoritesModule,
    SitemapModule,
    NewsletterModule,
    SettingsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
