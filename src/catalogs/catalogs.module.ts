import { Module } from '@nestjs/common';
import { RecognitionTypesService } from './services/recognition-types.service';
import { RecognitionTypesController } from './controllers/recognition-types.controller';

@Module({
  providers: [RecognitionTypesService],
  controllers: [RecognitionTypesController],
})
export class CatalogsModule {}
