import { forwardRef, Module } from '@nestjs/common';
import { JobPositionController } from './controller/job-position.controller';
import { JobPositionService } from './services/job-position.service';
import { PersonsModule } from 'src/persons/persons.module';
import { JobApplicationModule } from '../job-application/job-application.module';

@Module({
  imports: [
    PersonsModule,
    // JobApplicationModule,
    forwardRef(() => JobApplicationModule),
  ],
  controllers: [JobPositionController],
  providers: [JobPositionService],
  exports: [JobPositionService],
})
export class JobPositionModule {}
