import { Module } from '@nestjs/common';
import { LaboralExperienceController } from './controller/candidate.controller';
import { LaboralExperienceService } from './services/laboral-experience.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [LaboralExperienceController],
  providers: [LaboralExperienceService, PrismaService],
})
export class CandidateModule {}
