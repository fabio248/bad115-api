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
    const { testTypeId, mimeTypeFile, ...createData } = createTestDto;
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

    const [testT, urlDocs] = await this.prismaService.$transaction(
      async (tPrisma) => {
        if (!mimeTypeFile) {
          return [
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
          ];
        }

        const keyFile = `${uuidv4()}-test`;
        const file = await tPrisma.file.create({
          data: {
            name: keyFile,
          },
        });

        return Promise.all([
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
              file: {
                connect: {
                  id: file.id,
                },
              },
            },
          }),
          this.filesService.getSignedUrlForFileUpload({
            key: keyFile,
            folderName: candidate.id,
            mimeType: mimeTypeFile,
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
        file: true,
        candidate: true,
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

    let urlDocs = null;

    if (test.file) {
      urlDocs = await this.filesService.getSignedUrlForFileRetrieval({
        keyNameFile: test.file.name,
        folderName: test.candidate.id,
      });
    }

    return plainToInstance(TestDto, { ...test, urlDocs });
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
          file: true,
          candidate: true,
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

    const allTestWithUrlDocs = await Promise.all(
      allTest.map(async (test) => {
        let urlDocs = null;

        if (test.file) {
          urlDocs = await this.filesService.getSignedUrlForFileRetrieval({
            keyNameFile: test.file.name,
            folderName: test.candidate.id,
          });
        }

        return plainToInstance(TestDto, { ...test, urlDocs });
      }),
    );

    return {
      data: allTestWithUrlDocs,
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
