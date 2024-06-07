import { Module } from '@nestjs/common';
import { JobPositionController } from './controller/job-position.controller';
import { JobPositionService } from './services/job-position.service';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [PersonsModule],
  controllers: [JobPositionController],
  providers: [JobPositionService],
  exports: [JobPositionService],
})
export class JobPositionModule {}
