import { Module } from '@nestjs/common';
import { LaboralExperiencesController } from './controller/laboral-experiencies.controller';
import { LaboralExperiencesService } from './services/laboral-experiences.service';
import { AcademicKnowledgeService } from './services/academic-knowledge.service';
import { AcademicKnowledgeController } from './controller/academic-knowledge.controller';
import { CertificationsController } from './controller/certifications.controller';
import { CertificationsService } from './services/certifications.service';
import { LanguageSkillController } from './controller/language-skill.controller';
import { LanguageSkillService } from './services/language-skill.service';
import { RecognitionController } from './controller/recognition.controller';
import { RecognitionService } from './services/recognition.service';
import { TecnicalSkillCandidateController } from './controller/technical-skill-candidate.controller';
import { TechnicalSkillCandidateService } from './services/technical-skill-candidate.service';
import { ParticipationController } from './controller/participation.controller';
import { ParticipationService } from './services/participation.service';
import { PruebaController } from './controller/prueba.controller';
import { PruebaService } from './services/prueba.service';
import { PublicationController } from './controller/publication.controller';
import { PublicationService } from './services/publication.service';

@Module({
  controllers: [
    LaboralExperiencesController,
    AcademicKnowledgeController,
    CertificationsController,
    LanguageSkillController,
    RecognitionController,
    TecnicalSkillCandidateController,
    ParticipationController,
    PruebaController,
    PublicationController,
  ],
  providers: [
    LaboralExperiencesService,
    AcademicKnowledgeService,
    CertificationsService,
    LanguageSkillService,
    RecognitionService,
    TechnicalSkillCandidateService,
    ParticipationService,
    PruebaService,
    PublicationService,
  ],
})
export class CandidateModule {}
