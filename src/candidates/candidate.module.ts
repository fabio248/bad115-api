import { Module } from '@nestjs/common';
import { LaboralExperiencesController } from './controller/laboral-experiencies.controller';
import { LaboralExperiencesService } from './services/laboral-experiences.service';
import { AcademicKnowledgeService } from './services/academic-knowledge.service';
import { AcademicKnowledgeController } from './controller/academic-knowledge.controller';
import { CertificationsController } from './controller/certifications.controller';
import { CertificationsService } from './services/certifications.service';

@Module({
  controllers: [
    LaboralExperiencesController,
    AcademicKnowledgeController,
    CertificationsController,
  ],
  providers: [
    LaboralExperiencesService,
    AcademicKnowledgeService,
    CertificationsService,
  ],
})
export class CandidateModule {}
