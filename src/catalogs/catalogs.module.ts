import { Module } from '@nestjs/common';
import { RecognitionTypesService } from './services/recognition-types.service';
import { RecognitionTypesController } from './controllers/recognition-types.controller';
import { ParticipationTypesService } from './services/participation-types.service';
import { ParticipationTypesController } from './controllers/participation-types.controller';

@Module({
  providers: [RecognitionTypesService, ParticipationTypesService],
  controllers: [RecognitionTypesController, ParticipationTypesController],
})
export class CatalogsModule {}
