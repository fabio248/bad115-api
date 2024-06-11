import { Module } from '@nestjs/common';
import { MeetingController } from './controller/meeting.controller';
import { MeetingService } from './services/meeting.service';
import { RecruitersController } from './controller/recruiters.controller';
import { RecruitersService } from './services/recruiters.service';

@Module({
  controllers: [MeetingController, RecruitersController],
  providers: [MeetingService, RecruitersService],
})
export class RecruitersModule {}
