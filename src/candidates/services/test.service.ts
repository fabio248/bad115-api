import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from '../dto/request/create-test.dto';
import { TestDto } from '../dto/response/test.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

//Dto's
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateTestDto } from '../dto/request/update-test.dto';
import {
  getPaginationParams,
  getPaginationInfo,
} from 'src/common/utils/pagination.utils';
import { FilesService } from '../../files/services/files.service';

@Injectable()
export class TestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly filesService: FilesService,
  ) {}

  async create(id: string, createTestDto: CreateTestDto): Promise<TestDto> {
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

    const { testTypeId, mimeTypeFile, ...createData } = createTestDto;

    const testType = await this.prismaService.testType.findUnique({
      where: {
        id: testTypeId,
      },
    });

    if (!testType) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TEST_TYPE'),
          },
        }),
      );
    }

    const [urlDocs, testT] = await this.prismaService.$transaction(
      async (tPrisma) => {
        const keyFile = `${uuidv4()}-test`;

        return Promise.all([
          this.filesService.getSignedUrlForFileUpload({
            key: keyFile,
            folderName: candidate.id,
            mimeType: mimeTypeFile,
          }),
          tPrisma.test.create({
            data: {
              ...createData,
              testType: {
                connect: {
                  id: testTypeId,
                },
              },
              candidate: {
                connect: {
                  id: id,
                },
              },
            },
          }),
        ]);
      },
    );

    return plainToInstance(TestDto, { ...testT, urlDocs });
  }

  async findOne(id: string): Promise<TestDto> {
    const test = await this.prismaService.test.findFirst({
      where: {
        id: id,
      },
      include: {
        testType: true,
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
          testType: true,
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
    candidateI: string,
    testId: string,
  ): Promise<TestDto> {
    await this.findOne(testId);

    const { testTypeId, ...updateData } = updateTestDto;
    const updateTest = await this.prismaService.test.update({
      where: {
        id: testId,
      },
      data: {
        ...updateData,
        testType: {
          connect: {
            id: testTypeId,
          },
        },
        candidate: {
          connect: {
            id: candidateI,
          },
        },
      },
      include: {
        testType: true,
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
