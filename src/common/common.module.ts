import { Global, Module } from '@nestjs/common';
import { PrismaConfigService } from './services/prisma-config.service';
import { MailsService } from './services/mails.service';
import { MailsEvent } from './events/mail.event';
import { RecommendedJobPositionEvent } from './events/recommended-job-position.event';
import { JobPositionModule } from '../job-position/job-position.module';

@Global()
@Module({
  imports: [JobPositionModule],
  providers: [
    PrismaConfigService,
    MailsService,
    MailsEvent,
    RecommendedJobPositionEvent,
  ],
  exports: [PrismaConfigService],
})
export class CommonModule {}
