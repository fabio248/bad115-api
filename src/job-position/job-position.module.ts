import { Module } from '@nestjs/common';
import { JobPositionController } from './controller/job-position.controller';
import { JobPositionService } from './services/job-position.service';

@Module({
  imports: [],
  controllers: [JobPositionController],
  providers: [JobPositionService],
  exports: [JobPositionService],
})
export class JobPositionModule {}
