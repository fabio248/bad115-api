import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';
//dto
import { LanguageSkillDto } from '../dto/response/language-skill.dto';
import { CreateLanguageSkillDto } from '../dto/request/create-language-skill.dto';
import { UpdateLanguageSkillDto } from '../dto/request/update-language-skill.dto';

//paginaciones
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';

import {
  getPaginationParams,
  getPaginationInfo,
} from '../../common/utils/pagination.utils';

@Injectable()
export class LanguageSkillService {
  private readonly logger = new Logger(LanguageSkillService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createLanguageSkill: CreateLanguageSkillDto,
    id: string,
  ): Promise<LanguageSkillDto> {
    this.logger.log('Creating language skill');
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
    const { languageId, ...createData } = createLanguageSkill;
    const languageSkill = this.prismaService.languageSkill.create({
      data: {
        ...createData,
        language: {
          connect: {
            id: languageId,
          },
        },
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(LanguageSkillDto, languageSkill);
  }

  async findOne(id: string): Promise<LanguageSkillDto> {
    this.logger.log('Searching a language skill');
    const languageSkill = this.prismaService.languageSkill.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        language: true,
      },
    });

    if (!languageSkill) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LANGUAGE_SKILL'),
          },
        }),
      );
    }

    return plainToInstance(LanguageSkillDto, languageSkill);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<LanguageSkillDto>> {
    this.logger.log('Searching all language skills');
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
            entity: this.i18n.t('entities.LANGUAGE_SKILL'),
          },
        }),
      );
    }

    const { skip, take } = getPaginationParams(pageDto);
    const [allLanguageSkill, totalItems] = await Promise.all([
      this.prismaService.languageSkill.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
        include: {
          language: true,
        },
      }),
      this.prismaService.languageSkill.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(LanguageSkillDto, allLanguageSkill),
      pagination,
    };
  }

  async update(
    updateLanguageSkillDto: UpdateLanguageSkillDto,
    id: string,
    candidateId: string,
  ) {
    this.logger.log('update informacion of language skill');
    const languageSkill = this.findOne(id);
    if (!languageSkill) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LANGUAGE_SKILL'),
          },
        }),
      );
    }

    const { languageId, ...updateData } = updateLanguageSkillDto;
    const updateLanguageSkill = await this.prismaService.languageSkill.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        language: {
          connect: {
            id: languageId,
          },
        },
        candidate: {
          connect: {
            id: candidateId,
          },
        },
      },
    });

    return plainToInstance(LanguageSkillDto, updateLanguageSkill);
  }

  async remove(id: string) {
    this.logger.log('delete informacion of language skill');
    await this.findOne(id);

    await this.prismaService.languageSkill.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
