import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';

//dto's
import { CreateAcademicKnowledgeDto } from '../dto/request/create-academic-knowledge.dto';
import { AcademicKnowledgeDto } from '../dto/response/academic-knowledge.dto';

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
}
