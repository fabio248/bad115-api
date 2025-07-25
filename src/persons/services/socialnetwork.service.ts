import { Injectable, NotFoundException } from '@nestjs/common';

//Dto's
import { SocialNetworkDto } from '../dtos/response/social-network.dto';
import { CreateSocialNetworkDto } from '../dtos/request/create-social-network.dto';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { UpdateSocialNetworkDto } from '../dtos/request/update-red-social.dto';

@Injectable()
export class SocialNetworkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createRedSocialDto: CreateSocialNetworkDto,
    id: string,
  ): Promise<SocialNetworkDto> {
    const person = await this.prismaService.person.findUnique({
      where: {
        id: id,
      },
    });

    if (!person) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PERSON'),
          },
        }),
      );
    }
    const { typeSocialNetworkId, ...createData } = createRedSocialDto;
    const redSocial = this.prismaService.socialNetwork.create({
      data: {
        ...createData,
        typeSocialNetwork: {
          connect: { id: typeSocialNetworkId },
        },
        person: {
          connect: {
            id: id,
          },
        },
      },
    });

    return plainToInstance(SocialNetworkDto, redSocial);
  }

  async findOne(id: string): Promise<SocialNetworkDto> {
    const socialNetwork = await this.prismaService.socialNetwork.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        typeSocialNetwork: true,
      },
    });

    if (!socialNetwork) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.SOCIAL_NETWORK'),
          },
        }),
      );
    }
    return plainToInstance(SocialNetworkDto, socialNetwork);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<SocialNetworkDto>> {
    const person = await this.prismaService.person.findUnique({
      where: {
        id: id,
      },
    });
    if (!person) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PERSON'),
          },
        }),
      );
    }
    const { skip, take } = getPaginationParams(pageDto);
    const [allSocialNetwork, totalItems] = await Promise.all([
      this.prismaService.socialNetwork.findMany({
        skip,
        take,
        where: {
          personId: id,
          deletedAt: null,
        },
        include: {
          typeSocialNetwork: true,
        },
      }),
      this.prismaService.socialNetwork.count({
        where: {
          personId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(SocialNetworkDto, allSocialNetwork),
      pagination,
    };
  }

  async update(
    updateSocialNetworkDto: UpdateSocialNetworkDto,
    id: string,
  ): Promise<SocialNetworkDto> {
    const socialNetwork = this.findOne(id);
    if (!socialNetwork) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.SOCIAL_NETWORK'),
          },
        }),
      );
    }

    const { typeSocialNetworkId, ...updateData } = updateSocialNetworkDto;
    const updateSocialNetwork = await this.prismaService.socialNetwork.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        typeSocialNetwork: {
          connect: { id: typeSocialNetworkId },
        },
      },
    });

    return plainToInstance(SocialNetworkDto, updateSocialNetwork);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.socialNetwork.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
