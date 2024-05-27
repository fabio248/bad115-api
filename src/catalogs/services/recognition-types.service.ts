import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecognitionTypesDto } from '../dtos/response/recognition-types.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { PageDto } from '../../common/dtos/request/page.dto';
import { CreateRecognitionTypesDto } from '../dtos/request/create-recognition-types.dto';
import { UpdateParticipationTypesDto } from '../dtos/request/update-participation-types.dto';

@Injectable()
export class RecognitionTypesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const recognitionTypes = await this.prismaService.recognitionType.findMany({
      where: {
        deletedAt: null,
      },
    });

    return plainToInstance(RecognitionTypesDto, recognitionTypes);
  }

  async delete(id: string): Promise<RecognitionTypesDto> {
    const participationType = await this.prismaService.recognitionType.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return plainToInstance(RecognitionTypesDto, participationType);
  }

  async findAllPaginated(
    pageDto: PageDto,
  ): Promise<PaginatedDto<RecognitionTypesDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const [recognitionTypes, totalItems] = await Promise.all([
      this.prismaService.recognitionType.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.recognitionType.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(RecognitionTypesDto, recognitionTypes),
      pagination,
    };
  }

  async findById(id: string): Promise<RecognitionTypesDto> {
    const recognitionType = await this.prismaService.recognitionType.findUnique(
      {
        where: {
          id,
          deletedAt: null,
        },
      },
    );

    return plainToInstance(RecognitionTypesDto, recognitionType);
  }

  async create(
    createParticipationTypesDto: CreateRecognitionTypesDto,
  ): Promise<RecognitionTypesDto> {
    const participationType = await this.prismaService.recognitionType.create({
      data: createParticipationTypesDto,
    });

    return plainToInstance(RecognitionTypesDto, participationType);
  }

  async update(
    id: string,
    updateParticipationTypesDto: UpdateParticipationTypesDto,
  ): Promise<RecognitionTypesDto> {
    const participationType = await this.prismaService.recognitionType.update({
      where: {
        id,
      },
      data: updateParticipationTypesDto,
    });

    return plainToInstance(RecognitionTypesDto, participationType);
  }
}
