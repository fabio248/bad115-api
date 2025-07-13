import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';

//dto's
import { CreateAcademicKnowledgeDto } from '../dto/request/create-academic-knowledge.dto';
import { AcademicKnowledgeDto } from '../dto/response/academic-knowledge.dto';
import { UpdateAcademicKnowledgeDto } from '../dto/request/update-academic-knowledge.dto';
//pagination
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
@Injectable()
export class AcademicKnowledgeService {
  private readonly logger = new Logger(AcademicKnowledgeService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createAcademicKnowledge: CreateAcademicKnowledgeDto,
    id: string,
  ): Promise<AcademicKnowledgeDto> {
    this.logger.log('create');

    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
      },
    });
    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CANDIDATE'),
          },
        }),
      );
    }
    const result = await this.prismaService.academicKnowledge.create({
      data: {
        ...createAcademicKnowledge,
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(AcademicKnowledgeDto, result);
  }

  async findOne(id: string): Promise<AcademicKnowledgeDto> {
    const academicKnowledge =
      await this.prismaService.academicKnowledge.findFirst({
        where: {
          id: id,
          deletedAt: null,
        },
      });
    if (!academicKnowledge) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.ACADEMIC_KNOWLEDGE'),
          },
        }),
      );
    }
    return plainToInstance(AcademicKnowledgeDto, academicKnowledge);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<AcademicKnowledgeDto>> {
    this.logger.log('search all academic knowledge of the candidate');
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LABORAL_EXPERIENCE'),
          },
        }),
      );
    }
    const { skip, take } = getPaginationParams(pageDto);
    const [allAcademicKnowledge, totalItems] = await Promise.all([
      this.prismaService.academicKnowledge.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
      this.prismaService.academicKnowledge.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(AcademicKnowledgeDto, allAcademicKnowledge),
      pagination,
    };
  }
  async update(
    updateAcademicKnowledgeDto: UpdateAcademicKnowledgeDto,
    id: string,
    canid: string,
  ) {
    this.logger.log('update academicKnowledge');
    const academicKnowledge = this.findOne(id);
    if (!academicKnowledge) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.ACADEMIC_KNOWLEDGE'),
          },
        }),
      );
    }
    const updateAcademicKnowledge =
      await this.prismaService.academicKnowledge.update({
        where: {
          id,
        },
        data: {
          ...updateAcademicKnowledgeDto,
          candidate: {
            connect: {
              id: canid,
            },
          },
        },
      });

    return plainToInstance(AcademicKnowledgeDto, updateAcademicKnowledge);
  }
  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.academicKnowledge.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
