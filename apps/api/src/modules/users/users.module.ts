import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users.model'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
