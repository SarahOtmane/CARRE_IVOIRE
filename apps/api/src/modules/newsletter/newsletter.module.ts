import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { NewsletterSubscriber } from './newsletter-subscriber.model'
import { NewsletterRepository } from './newsletter.repository'
import { NewsletterService } from './newsletter.service'
import { NewsletterController } from './newsletter.controller'

@Module({
  imports: [SequelizeModule.forFeature([NewsletterSubscriber])],
  providers: [NewsletterRepository, NewsletterService],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
