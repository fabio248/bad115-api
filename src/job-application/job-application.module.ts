import { Module } from '@nestjs/common';
import { JobApplicationController } from './controllers/job-aplication/job-application.controller';
import { JobApplicationService } from './services/job-aplication/job-application.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
