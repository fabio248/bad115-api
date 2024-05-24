import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateParticipationDto } from '../dto/request/create-participation.dto';
import { ParticipationDto } from '../dto/response/participation.dto';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import {
  getPaginationParams,
  getPaginationInfo,
} from 'src/common/utils/pagination.utils';

//paginations
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateParticipationDto } from '../dto/request/update-participation.dto';

@Injectable()
export class ParticipationService {
  private readonly logger = new Logger(ParticipationService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    id: string,
    createParticipationDto: CreateParticipationDto,
  ): Promise<ParticipationDto> {
    this.logger.log('Creating Participation content');
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
    const { participationTypeId, ...createData } = createParticipationDto;
    const participation = this.prismaService.participation.create({
      data: {
        ...createData,
        participationType: {
          connect: {
            id: participationTypeId,
          },
        },
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });

    return plainToInstance(ParticipationDto, participation);
  }

  async findOne(id: string): Promise<ParticipationDto> {
    this.logger.log('Finding Participation content');
    const participation = await this.prismaService.participation.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        participationType: true,
      },
    });

    if (!participation) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PARTICIPATION'),
          },
        }),
      );
    }
    return plainToInstance(ParticipationDto, participation);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<ParticipationDto>> {
    this.logger.log('Searching all participacions');
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
      },
    });
    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PARTICIPATION'),
          },
        }),
      );
    }
    const { skip, take } = getPaginationParams(pageDto);
    const [allParticipation, totalItems] = await Promise.all([
      this.prismaService.participation.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
        include: {
          participationType: true,
        },
      }),
      this.prismaService.participation.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(ParticipationDto, allParticipation),
      pagination,
    };
  }

  async update(
    updateParticipationDto: UpdateParticipationDto,
    id: string,
  ): Promise<ParticipationDto> {
    this.logger.log('update informacion of participacions');
    const participation = this.findOne(id);
    if (!participation) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PARTICIPATION'),
          },
        }),
      );
    }

    const { participationTypeId, ...updateData } = updateParticipationDto;
    const updateParticipation = await this.prismaService.participation.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        participationType: {
          connect: { id: participationTypeId },
        },
      },
    });

    return plainToInstance(ParticipationDto, updateParticipation);
  }

  async remove(id: string) {
    this.logger.log('delete informacion of participation');
    await this.findOne(id);

    await this.prismaService.participation.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
