import { Injectable } from '@nestjs/common';
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

@Injectable()
export class TechnicalSkillService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<CategoryTechnicalSkillDto[]> {
    const categoryTechnicalSkill =
      await this.prismaService.categoryTechnicalSkill.findMany();

    return plainToInstance(CategoryTechnicalSkillDto, categoryTechnicalSkill);
  }

  async findAllById(id: string): Promise<TechnicalSkillDto[]> {
    const technicalSkill = await this.prismaService.technicalSkill.findMany({
      where: {
        categoryTechnicalSkillId: id,
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
}
