import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';

//dto's
import { TechnicalSkillCandidateDto } from '../dto/response/technical-skill-candidate.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationParams,
  getPaginationInfo,
} from '../../common/utils/pagination.utils';

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

    const existTechnicalSkillCandidate =
      await this.prismaService.technicalSkillCandidate.findFirst({
        where: {
          candidateId,
          technicalSkillId,
          deletedAt: null,
        },
      });

    if (existTechnicalSkillCandidate) {
      throw new NotFoundException(
        this.i18n.t('exception.CONFLICT.TECHNICAL_SKILL_ALREADY_EXISTS'),
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

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillCandidateDto>> {
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
      },
    });
    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECOGNITION'),
          },
        }),
      );
    }

    const { skip, take } = getPaginationParams(pageDto);
    const [allTechnicalSkillCandidate, totalItems] = await Promise.all([
      this.prismaService.technicalSkillCandidate.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
        include: {
          technicalSkill: {
            include: {
              categoryTechnicalSkill: true,
            },
          },
        },
      }),
      this.prismaService.technicalSkillCandidate.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(
        TechnicalSkillCandidateDto,
        allTechnicalSkillCandidate,
      ),
      pagination,
    };
  }

  async findOne(candidateId: string, technicalSkillId: string) {
    const technicalSkillCandidate =
      await this.prismaService.technicalSkillCandidate.findFirst({
        where: {
          candidateId,
          technicalSkillId,
        },
      });

    if (!technicalSkillCandidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TECHNICAL_SKILL_CANDIDATE'),
          },
        }),
      );
    }

    return plainToInstance(TechnicalSkillCandidateDto, technicalSkillCandidate);
  }

  async remove(candidateId: string, technicalSkillId: string) {
    const technicalSkillCandidate =
      await this.prismaService.technicalSkillCandidate.findFirst({
        where: {
          candidateId,
          technicalSkillId,
        },
      });

    if (!technicalSkillCandidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TECHNICAL_SKILL_CANDIDATE'),
          },
        }),
      );
    }

    await this.prismaService.technicalSkillCandidate.update({
      where: {
        id: technicalSkillCandidate.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
