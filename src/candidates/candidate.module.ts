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
import { PruebaController } from './controller/test.controller';
import { TestService } from './services/test.service';
import { PublicationController } from './controller/publication.controller';
import { PublicationService } from './services/publication.service';
import { RecomendationController } from './controller/recomendation.controller';
import { RecomendationService } from './services/recomendation.service';
import { PdfGenerateController } from './controller/pdf-generate.controller';
import { PdfGenerateService } from './services/pdf-generate.service';
import { CandidateController } from './controller/candidate.controller';
import { CandidateService } from './services/candidate.service';
import { FilesModule } from '../files/files.module';
import { PrivacySettingsController } from './controller/privacy-settings.controller';
import { PrivacySettingsService } from './services/privacy-settings.service';
import { JobApplicationModule } from '../job-application/job-application.module';

@Module({
  imports: [FilesModule, JobApplicationModule],
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
    RecomendationController,
    PdfGenerateController,
    CandidateController,
    PrivacySettingsController,
  ],
  providers: [
    LaboralExperiencesService,
    AcademicKnowledgeService,
    CertificationsService,
    LanguageSkillService,
    RecognitionService,
    TechnicalSkillCandidateService,
    ParticipationService,
    TestService,
    PublicationService,
    RecomendationService,
    PdfGenerateService,
    CandidateService,
    PrivacySettingsService,
  ],
})
export class CandidateModule {}
