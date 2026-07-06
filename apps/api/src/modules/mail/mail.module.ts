import { Global, Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { PdfService } from './pdf.service'

@Global()
@Module({
  providers: [MailService, PdfService],
  exports: [MailService],
})
export class MailModule {}
