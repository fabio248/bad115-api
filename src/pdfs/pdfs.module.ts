import { Module } from '@nestjs/common';
import { PdfsService } from './services/pdfs.service';
import { PdfsController } from './controllers/pdfs.controller';

@Module({
  providers: [PdfsService],
  controllers: [PdfsController],
})
export class PdfsModule {}
