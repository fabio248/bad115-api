import { Module } from '@nestjs/common';
import { LaboralExperienceController } from './controller/candidate.controller';
import { LaboralExperienceService } from './services/laboral-experience.service';
import { AcademicKnowledgeService } from './services/academic-knowledge.service';
import { AcademicKnowledgeController } from './controller/academic-knowledge.controller';

@Module({
  controllers: [LaboralExperienceController, AcademicKnowledgeController],
  providers: [LaboralExperienceService, AcademicKnowledgeService],
})
export class CandidateModule {}
