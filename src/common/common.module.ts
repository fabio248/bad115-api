import { Global, Module } from '@nestjs/common';
import { PrismaConfigService } from './services/prisma-config.service';
import { MailsService } from './services/mails.service';
import { MailsEvent } from './events/mail.event';

@Global()
@Module({
  imports: [],
  providers: [PrismaConfigService, MailsService, MailsEvent],
  exports: [PrismaConfigService],
})
export class CommonModule {}
