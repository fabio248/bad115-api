import { Module } from '@nestjs/common';
import { RecognitionTypesService } from './services/recognition-types.service';
import { RecognitionTypesController } from './controllers/recognition-types.controller';
import { ParticipationTypesService } from './services/participation-types.service';
import { ParticipationTypesController } from './controllers/participation-types.controller';
import { SocialNetworkTypesService } from './services/social-network-types.service';
import { SocialNetworkTypesController } from './controllers/social-network-types.controller';
import { TechnicalSkillController } from './controllers/category-technical-skill.controller';
import { TechnicalSkillService } from './services/category-technical-skill.service';

@Module({
  providers: [
    RecognitionTypesService,
    ParticipationTypesService,
    SocialNetworkTypesService,
    TechnicalSkillService,
  ],
  controllers: [
    RecognitionTypesController,
    ParticipationTypesController,
    SocialNetworkTypesController,
    TechnicalSkillController,
  ],
})
export class CatalogsModule {}
