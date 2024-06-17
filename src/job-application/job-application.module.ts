import { forwardRef, Module } from '@nestjs/common';
import { JobApplicationController } from './controllers/job-aplication/job-application.controller';
import { JobApplicationService } from './services/job-aplication/job-application.service';
import { FilesModule } from 'src/files/files.module';
import { JobPositionModule } from '../job-position/job-position.module';

@Module({
  imports: [FilesModule, forwardRef(() => JobPositionModule)],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
