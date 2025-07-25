import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import {
  getPaginationParams,
  getPaginationInfo,
} from '../../common/utils/pagination.utils';
//dto's
import { RecognitionDto } from '../dto/response/recognition.dto';
import { CreateRecognitionDto } from '../dto/request/create-recognition.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { UpdateRecognitionDto } from '../dto/request/update-recognition.dto';

@Injectable()
export class RecognitionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    id: string,
    createRecognitionDto: CreateRecognitionDto,
  ): Promise<RecognitionDto> {
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

    const { recognitionTypeId, ...createData } = createRecognitionDto;

    const recognition = await this.prismaService.recognition.create({
      data: {
        ...createData,
        recognitionType: {
          connect: {
            id: recognitionTypeId,
          },
        },
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(RecognitionDto, recognition);
  }

  async findOne(id: string): Promise<RecognitionDto> {
    const recognition = await this.prismaService.recognition.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        recognitionType: true,
      },
    });

    if (!recognition) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECOGNITION'),
          },
        }),
      );
    }

    return plainToInstance(RecognitionDto, recognition);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<RecognitionDto>> {
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
    const { skip, take } = getPaginationParams(pageDto);
    const [allRecognition, totalItems] = await Promise.all([
      this.prismaService.recognition.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
        include: {
          recognitionType: true,
        },
      }),
      this.prismaService.recognition.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(RecognitionDto, allRecognition),
      pagination,
    };
  }

  async update(
    updateRecognitionDto: UpdateRecognitionDto,
    id: string,
  ): Promise<RecognitionDto> {
    const recognition = this.findOne(id);

    if (!recognition) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECOGNITION'),
          },
        }),
      );
    }

    const { recognitionTypeId, ...updateData } = updateRecognitionDto;
    const updateRecognition = await this.prismaService.recognition.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        recognitionType: {
          connect: { id: recognitionTypeId },
        },
      },
      include: {
        recognitionType: true,
      },
    });

    return plainToInstance(RecognitionDto, updateRecognition);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.recognition.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
