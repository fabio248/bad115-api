import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';

//Dto's
import { CreateLanguageTypesDto } from '../dtos/request/create-language-type.dto';
import { LanguageTypesDto } from '../dtos/response/language-type.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateLanguageTypeDto } from '../dtos/request/update-language-type.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { FilterLanguageDto } from '../dtos/request/filter-language.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LanguageTypeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createLanguageTypesDto: CreateLanguageTypesDto,
  ): Promise<LanguageTypesDto> {
    const languagetype = await this.prismaService.language.create({
      data: {
        ...createLanguageTypesDto,
      },
    });
    return plainToInstance(LanguageTypesDto, languagetype);
  }

  async findOne(id: string): Promise<LanguageTypesDto> {
    const languageType = await this.prismaService.language.findUnique({
      where: {
        id,
      },
    });
    if (!languageType) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LANGUAGE'),
          },
        }),
      );
    }
    return plainToInstance(LanguageTypesDto, languageType);
  }

  async findAll(): Promise<LanguageTypesDto[]> {
    const languageTypes = await this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        language: 'asc',
      },
    });
    return plainToInstance(LanguageTypesDto, languageTypes);
  }

  async findAllPaginated(
    pageDto: PageDto,
    { search }: FilterLanguageDto,
  ): Promise<PaginatedDto<LanguageTypesDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const whereInput: Prisma.LanguageWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereInput.language = {
        contains: search,
      };
    }

    const [languageTypes, totalItems] = await Promise.all([
      this.prismaService.language.findMany({
        where: whereInput,
        orderBy: {
          language: 'asc',
        },
        skip,
        take,
      }),
      this.prismaService.language.count({
        where: whereInput,
      }),
    ]);

    return {
      data: plainToInstance(LanguageTypesDto, languageTypes),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }

  async update(
    id: string,
    updateLanguageTypeDto: UpdateLanguageTypeDto,
  ): Promise<LanguageTypesDto> {
    const languageType = this.findOne(id);
    if (!languageType) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LANGUAGE'),
          },
        }),
      );
    }
    const updateLanguageType = await this.prismaService.language.update({
      where: {
        id,
      },
      data: {
        ...updateLanguageTypeDto,
      },
    });
    return plainToInstance(LanguageTypesDto, updateLanguageType);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.language.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
