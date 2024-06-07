import { Module } from '@nestjs/common';
import { JobAplicationController } from './controllers/job-aplication/job-aplication.controller';
import { JobAplicationService } from './services/job-aplication/job-aplication.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [JobAplicationController],
  providers: [JobAplicationService],
  exports: [JobAplicationService],
})
export class JobAplicationModule {}
