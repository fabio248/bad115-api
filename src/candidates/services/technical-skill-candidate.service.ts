import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';

//dto's
import { TechnicalSkillCandidateDto } from '../dto/response/technical-skill-candidate.dto';

@Injectable()
export class TechnicalSkillCandidateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    candidateId: string,
    technicalSkillId: string,
    categoryId: string,
  ): Promise<TechnicalSkillCandidateDto> {
    const candidate = await this.prismaService.candidate.findFirst({
      where: {
        id: candidateId,
      },
    });
    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TECHNICAL_SKILL_CANDIDATE'),
          },
        }),
      );
    }
    const technicalSkill = await this.prismaService.technicalSkill.findFirst({
      where: {
        id: technicalSkillId,
        categoryTechnicalSkillId: categoryId,
      },
    });
    if (!technicalSkill) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TECHNICAL_SKILL'),
          },
        }),
      );
    }
    const technicalSkillCandidate =
      await this.prismaService.technicalSkillCandidate.create({
        data: {
          technicalSkill: {
            connect: {
              id: technicalSkillId,
            },
          },
          candidate: {
            connect: { id: candidateId },
          },
        },
      });

    return plainToInstance(TechnicalSkillCandidateDto, technicalSkillCandidate);
  }
}
