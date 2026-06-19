import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    AuthModule,
    UsersModule,
    HealthModule,
    UploadsModule,
    CategoriesModule,
    TaxRatesModule,
    ProductsModule,
    OrdersModule,
    FavoritesModule,
  ],
})
export class AppModule {}
