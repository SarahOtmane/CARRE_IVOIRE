import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from '@/modules/users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { LoginAttemptsService } from './login-attempts.service'
import { RefreshTokensRepository } from './refresh-tokens.repository'
import { RefreshToken } from './refresh-token.model'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AdminGuard } from './guards/admin.guard'
import { RefreshTokensCleanupService } from './refresh-tokens-cleanup.service'

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRATION', '1h')) as any,
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [AuthService, LoginAttemptsService, RefreshTokensRepository, JwtStrategy, JwtAuthGuard, AdminGuard, RefreshTokensCleanupService],
  controllers: [AuthController],
  exports: [JwtAuthGuard, AdminGuard, AuthService],
})
export class AuthModule { }
