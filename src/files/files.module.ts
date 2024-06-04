import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';

@Module({
  providers: [FilesService],
})
export class FilesModule {}
