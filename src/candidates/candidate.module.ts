import { Module } from '@nestjs/common';
import { LaboralExperiencesController } from './controller/laboral-experiencies.controller';
import { LaboralExperiencesService } from './services/laboral-experiences.service';
import { AcademicKnowledgeService } from './services/academic-knowledge.service';
import { AcademicKnowledgeController } from './controller/academic-knowledge.controller';

@Module({
  controllers: [LaboralExperiencesController, AcademicKnowledgeController],
  providers: [LaboralExperiencesService, AcademicKnowledgeService],
})
export class CandidateModule {}
