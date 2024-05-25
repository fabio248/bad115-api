import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecomendationDto } from '../dto/request/create-recomendation.dto';
import { RecomendationDto } from '../dto/response/recomendation.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

//paginations
import {
  getPaginationParams,
  getPaginationInfo,
} from 'src/common/utils/pagination.utils';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateRecomendationDto } from '../dto/request/update-recomendation.dto';

@Injectable()
export class RecomendationService {
  private readonly includeRelationUserPerson: Prisma.RecomendationInclude = {
    users: {
      select: {
        email: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    id: string,
    userId: string,
    createRecomendationDto: CreateRecomendationDto,
  ): Promise<RecomendationDto> {
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
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.USER'),
          },
        }),
      );
    }
    const recommendation = await this.prismaService.recomendation.create({
      data: {
        ...createRecomendationDto,
        candidate: {
          connect: {
            id: id,
          },
        },
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return plainToInstance(RecomendationDto, recommendation);
  }

  async findOne(id: string): Promise<RecomendationDto> {
    const recomendation = await this.prismaService.recomendation.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
      include: this.includeRelationUserPerson,
    });
    if (!recomendation) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECOMENDATION'),
          },
        }),
      );
    }
    return plainToInstance(RecomendationDto, recomendation);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<RecomendationDto>> {
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
    const [allRecomendation, totalItems] = await Promise.all([
      this.prismaService.recomendation.findMany({
        skip,
        take,
        where: {
          candidateId: id,
          deletedAt: null,
        },
        include: this.includeRelationUserPerson,
      }),
      this.prismaService.recomendation.count({
        where: {
          candidateId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(RecomendationDto, allRecomendation),
      pagination,
    };
  }

  async update(
    updateRecomendationDto: UpdateRecomendationDto,
    id: string,
    recoId: string,
  ): Promise<RecomendationDto> {
    const recomendation = this.findOne(recoId);
    if (!recomendation) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECOMENDATION'),
          },
        }),
      );
    }

    const updateRecomendation = await this.prismaService.recomendation.update({
      where: {
        id: recoId,
      },
      data: {
        ...updateRecomendationDto,
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });

    return plainToInstance(RecomendationDto, updateRecomendation);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.recomendation.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
