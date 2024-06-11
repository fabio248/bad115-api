import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { CategoryTechnicalSkillDto } from '../dtos/response/category-technical-skill.dto';
import { TechnicalSkillDto } from '../dtos/response/technical-skill.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from 'src/common/utils/pagination.utils';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { I18nService } from 'nestjs-i18n';
import { CreateTechnicalSkillDto } from '../dtos/request/create-technical-skill.dto';
import { UpdateTechnicalSkillTypeDto } from '../dtos/request/update-technical-skill.dto';
import { CreateCategoryDto } from 'src/candidates/dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';
import { Prisma } from '@prisma/client';
import { FilterTechnicalSkillDto } from '../dtos/request/filter-technical-skill.dto';

@Injectable()
export class TechnicalSkillService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    id: string,
    createTechnicalSkillDto: CreateTechnicalSkillDto,
  ): Promise<TechnicalSkillDto> {
    const category = this.prismaService.categoryTechnicalSkill.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CATEGORY'),
          },
        }),
      );
    }

    const technicalSkill = await this.prismaService.technicalSkill.create({
      data: {
        ...createTechnicalSkillDto,
        categoryTechnicalSkill: {
          connect: {
            id: id,
          },
        },
      },
    });

    return plainToInstance(TechnicalSkillDto, technicalSkill);
  }

  async findOne(id: string): Promise<TechnicalSkillDto> {
    const technicalSkill = await this.prismaService.technicalSkill.findUnique({
      where: {
        id,
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
    return plainToInstance(TechnicalSkillDto, technicalSkill);
  }

  async findAll(): Promise<CategoryTechnicalSkillDto[]> {
    const categoryTechnicalSkill =
      await this.prismaService.categoryTechnicalSkill.findMany({
        where: { deletedAt: null },
      });

    return plainToInstance(CategoryTechnicalSkillDto, categoryTechnicalSkill);
  }

  async findAllOnlyCategory(): Promise<CategoryTechnicalSkillDto[]> {
    const categoryTechnicalSkill =
      await this.prismaService.technicalSkill.findMany({
        where: { deletedAt: null },
      });

    return plainToInstance(CategoryTechnicalSkillDto, categoryTechnicalSkill);
  }

  async findAllById(id: string): Promise<TechnicalSkillDto[]> {
    const technicalSkill = await this.prismaService.technicalSkill.findMany({
      where: {
        categoryTechnicalSkillId: id,
        deletedAt: null,
      },
    });

    return plainToInstance(TechnicalSkillDto, technicalSkill);
  }

  async findAllPaginated(
    pageDto: PageDto,
  ): Promise<PaginatedDto<CategoryTechnicalSkillDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const [allCategoryTechnicalSkill, totalItems] = await Promise.all([
      this.prismaService.categoryTechnicalSkill.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.categoryTechnicalSkill.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(
        CategoryTechnicalSkillDto,
        allCategoryTechnicalSkill,
      ),
      pagination,
    };
  }

  async findAllByIdPaginated(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const [allTechnicalSkill, totalItems] = await Promise.all([
      this.prismaService.technicalSkill.findMany({
        skip,
        take,
        where: {
          categoryTechnicalSkillId: id,
          deletedAt: null,
        },
      }),
      this.prismaService.categoryTechnicalSkill.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(TechnicalSkillDto, allTechnicalSkill),
      pagination,
    };
  }

  async update(
    id: string,
    updateTechnicalSkillTypeDto: UpdateTechnicalSkillTypeDto,
  ): Promise<TechnicalSkillDto> {
    await this.findOne(id);

    const { categoryTechnicalSkillId, ...updateData } =
      updateTechnicalSkillTypeDto;

    const technicalSkill = await this.prismaService.technicalSkill.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        categoryTechnicalSkill: {
          connect: {
            id: categoryTechnicalSkillId,
          },
        },
      },
    });

    return plainToInstance(TechnicalSkillDto, technicalSkill);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prismaService.technicalSkill.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryTechnicalSkillDto> {
    const category = await this.prismaService.categoryTechnicalSkill.create({
      data: {
        ...createCategoryDto,
      },
    });

    if (!category) {
      throw new BadGatewayException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CATEGORY'),
          },
        }),
      );
    }

    return plainToInstance(CategoryTechnicalSkillDto, category);
  }

  async findOneCategory(id: string): Promise<CategoryTechnicalSkillDto> {
    const category = await this.prismaService.categoryTechnicalSkill.findUnique(
      {
        where: {
          id,
        },
        include: {
          technicalSkill: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    );
    if (!category) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CATEGORY'),
          },
        }),
      );
    }
    return plainToInstance(CategoryTechnicalSkillDto, category);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<TechnicalSkillDto> {
    await this.findOneCategory(id);
    const category = await this.prismaService.categoryTechnicalSkill.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });

    return plainToInstance(TechnicalSkillDto, category);
  }

  async removeCategory(id: string): Promise<void> {
    await this.findOneCategory(id);

    await this.prismaService.categoryTechnicalSkill.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return;
  }

  async findAllTechnicalSkillPaginated(
    pageDto: PageDto,
    { search }: FilterTechnicalSkillDto,
  ): Promise<PaginatedDto<TechnicalSkillDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const whereInput: Prisma.TechnicalSkillWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereInput.OR = [
        { name: { contains: search } },
        {
          categoryTechnicalSkill: {
            name: { contains: search },
          },
        },
      ];
    }

    const [allTechnicalSkill, totalItems] = await Promise.all([
      this.prismaService.technicalSkill.findMany({
        skip,
        take,
        where: whereInput,
        include: {
          categoryTechnicalSkill: true,
        },
        orderBy: [
          {
            categoryTechnicalSkill: {
              name: 'asc',
            },
          },
          { name: 'asc' },
        ],
      }),
      this.prismaService.technicalSkill.count({
        where: whereInput,
      }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(TechnicalSkillDto, allTechnicalSkill),
      pagination,
    };
  }
}
