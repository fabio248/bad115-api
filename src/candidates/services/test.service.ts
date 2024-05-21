import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from '../dto/request/create-prueba.dto';
import { TestDto } from '../dto/response/test.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';

//Dto's
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateTestDto } from '../dto/request/update-test.dto';
import {
  getPaginationParams,
  getPaginationInfo,
} from 'src/common/utils/pagination.utils';

@Injectable()
export class TestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(id: string, createTestDto: CreateTestDto): Promise<TestDto> {
    const candidate = this.prismaService.candidate.findFirst({
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

    const { test } = createTestDto;
    const testT = await this.prismaService.test.create({
      data: {
        ...createTestDto,
        test: {
          create: test,
        },
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(TestDto, testT);
  }

  async findOne(id: string): Promise<TestDto> {
    const test = await this.prismaService.test.findFirst({
      where: {
        id: id,
      },
      include: {
        test: true,
      },
    });
    if (!test) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TEST'),
          },
        }),
      );
    }
    return plainToInstance(TestDto, test);
  }

  async findAll(id: string, pageDto: PageDto): Promise<PaginatedDto<TestDto>> {
    const candidate = await this.prismaService.candidate.findFirst({
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
    const { skip, take } = getPaginationParams(pageDto);
    const [allTest, totalItems] = await Promise.all([
      this.prismaService.test.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
        include: {
          test: true,
        },
      }),
      this.prismaService.test.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(TestDto, allTest),
      pagination,
    };
  }

  async update(
    updateTestDto: UpdateTestDto,
    canId: string,
    pruId: string,
  ): Promise<TestDto> {
    const prueba = this.findOne(pruId);

    if (!prueba) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TEST'),
          },
        }),
      );
    }
    const { test } = updateTestDto;
    const updateTest = await this.prismaService.test.update({
      where: {
        id: pruId,
      },
      data: {
        ...updateTestDto,
        test: {
          update: test,
        },
        candidate: {
          connect: {
            id: canId,
          },
        },
      },
      include: {
        test: true,
      },
    });

    return plainToInstance(TestDto, updateTest);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.test.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
