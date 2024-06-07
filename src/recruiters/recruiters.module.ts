import { Module } from '@nestjs/common';
import { MeetingController } from './controller/meeting.controller';
import { MeetingService } from './services/meeting.service';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class RecruitersModule {}
