import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from '../dto/request/create-publication.dto';
import { PublicationDto } from '../dto/response/publication.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import {
  getPaginationParams,
  getPaginationInfo,
} from 'src/common/utils/pagination.utils';
import { UpdatePublicationDto } from '../dto/request/update-publication.dto';

@Injectable()
export class PublicationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    id: string,
    createPublicationDto: CreatePublicationDto,
  ): Promise<PublicationDto> {
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

    const newCreatePublicationDto = { ...createPublicationDto };
    if (createPublicationDto.type === 'Articulo') {
      if (newCreatePublicationDto.isbn || newCreatePublicationDto.edition) {
        delete newCreatePublicationDto.isbn;
        delete newCreatePublicationDto.edition;
      }
    } else {
      if (!newCreatePublicationDto.isbn || !newCreatePublicationDto.edition)
        throw new NotAcceptableException(
          this.i18n.t('exception.CONFLICT.NO_SUPPORTED', {
            args: {
              entity: this.i18n.t('entities.PUBLICATION'),
            },
          }),
        );
    }

    const publication = await this.prismaService.publication.create({
      data: {
        ...newCreatePublicationDto,
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(PublicationDto, publication);
  }

  async findOne(id: string): Promise<PublicationDto> {
    const publication = await this.prismaService.publication.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        candidate: true,
      },
    });
    if (!publication) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PUBLICATION'),
          },
        }),
      );
    }
    return plainToInstance(PublicationDto, publication);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<PublicationDto>> {
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
    const [allPublication, totalItems] = await Promise.all([
      this.prismaService.publication.findMany({
        skip,
        take,
        where: {
          candidateId: candidate.id,
          deletedAt: null,
        },
        include: {
          candidate: true,
        },
      }),
      this.prismaService.publication.count({
        where: {
          candidateId: candidate.id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(PublicationDto, allPublication),
      pagination,
    };
  }

  async update(
    updatePublication: UpdatePublicationDto,
    id: string,
    candId: string,
  ): Promise<PublicationDto> {
    const publication = this.findOne(id);
    if (!publication) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.Publication'),
          },
        }),
      );
    }
    const newCreatePublicationDto = { ...updatePublication };
    if (updatePublication.type === 'Articulo') {
      if (newCreatePublicationDto.isbn || newCreatePublicationDto.edition) {
        delete newCreatePublicationDto.isbn;
        delete newCreatePublicationDto.edition;
      }
    } else {
      if (!newCreatePublicationDto.isbn || !newCreatePublicationDto.edition)
        throw new NotAcceptableException(
          this.i18n.t('exception.CONFLICT.NO_SUPPORTED', {
            args: {
              entity: this.i18n.t('entities.PUBLICATION'),
            },
          }),
        );
    }
    const updatePublicationData = await this.prismaService.publication.update({
      where: {
        id,
        candidateId: candId,
      },
      data: {
        ...newCreatePublicationDto,
        candidate: {
          connect: {
            id: candId,
          },
        },
      },
    });

    return plainToInstance(PublicationDto, updatePublicationData);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.publication.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
