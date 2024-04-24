import { Module } from '@nestjs/common';
import { LaboralExperienceController } from './controller/candidate.controller';
import { LaboralExperienceService } from './services/laboral-experience.service';
import { PrismaService } from 'nestjs-prisma';
import { AcademicKnowledgeService } from './services/academic-knowledge.service';

@Module({
  controllers: [LaboralExperienceController],
  providers: [
    LaboralExperienceService,
    PrismaService,
    AcademicKnowledgeService,
  ],
})
export class CandidateModule {}
