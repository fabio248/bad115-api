import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestTypeDto } from '../dtos/response/test-type.dto';
import { CreateTestTypeDto } from '../dtos/request/create-test-type.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { UpdateTestTypeDto } from '../dtos/request/update-test-type.dto';

@Injectable()
export class TestTypeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createLanguageTypesDto: CreateTestTypeDto,
  ): Promise<TestTypeDto> {
    const testType = await this.prismaService.testType.create({
      data: {
        ...createLanguageTypesDto,
      },
    });
    if (!testType) {
      throw new BadGatewayException(
        this.i18n.t('exception.INTERNAL_SERVER.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CATEGORY'),
          },
        }),
      );
    }
    return plainToInstance(TestTypeDto, testType);
  }

  async findOne(id: string): Promise<TestTypeDto> {
    const testType = await this.prismaService.testType.findUnique({
      where: {
        id,
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
    return plainToInstance(TestTypeDto, testType);
  }

  async findAll(): Promise<TestTypeDto[]> {
    const testTypes = await this.prismaService.testType.findMany();
    return plainToInstance(TestTypeDto, testTypes);
  }

  async update(
    id: string,
    updateTestTypeDto: UpdateTestTypeDto,
  ): Promise<TestTypeDto> {
    const testType = this.findOne(id);
    if (!testType) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TEST_TYPE'),
          },
        }),
      );
    }
    const updateTestType = await this.prismaService.testType.update({
      where: {
        id,
      },
      data: updateTestTypeDto,
    });
    return plainToInstance(TestTypeDto, updateTestType);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.testType.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
