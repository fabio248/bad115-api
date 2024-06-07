import { Module } from '@nestjs/common';
import { JobPositionController } from './controller/job-position.controller';
import { JobPositionService } from './services/job-position.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [JobPositionController],
  providers: [JobPositionService],
  exports: [JobPositionService],
})
export class JobPositionModule {}
