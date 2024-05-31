import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { SocialNetworkTypesDto } from '../dtos/response/social-network-types.dto';
import { CreateSocialNetworkTypesDto } from '../dtos/request/create-social-network-type.dto';
import { I18nService } from 'nestjs-i18n';
import { UpdateSocialNetworkTypesDto } from '../dtos/request/update-social-network-type.dto';

@Injectable()
export class SocialNetworkTypesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createSocialNetworkTypesDto: CreateSocialNetworkTypesDto,
  ): Promise<SocialNetworkTypesDto> {
    const socialNetworkTypes =
      await this.prismaService.typeSocialNetwork.create({
        data: {
          ...createSocialNetworkTypesDto,
        },
      });
    return plainToInstance(SocialNetworkTypesDto, socialNetworkTypes);
  }

  async findOne(id: string): Promise<SocialNetworkTypesDto> {
    const SocialNetworkTypeDto =
      await this.prismaService.typeSocialNetwork.findUnique({
        where: {
          id,
        },
      });
    if (!SocialNetworkTypeDto) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.SOCIAL_NETWORK'),
          },
        }),
      );
    }
    return plainToInstance(SocialNetworkTypesDto, SocialNetworkTypeDto);
  }

  async findAll() {
    const socialNetworkTypes =
      await this.prismaService.typeSocialNetwork.findMany();

    return plainToInstance(SocialNetworkTypesDto, socialNetworkTypes);
  }

  async update(
    id: string,
    updateSocialNetworkTypesDto: UpdateSocialNetworkTypesDto,
  ): Promise<SocialNetworkTypesDto> {
    const participacionType = this.findOne(id);

    if (!participacionType) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PARTICIPATION_TYPE'),
          },
        }),
      );
    }
    const updateSocialNetworkTypes =
      await this.prismaService.typeSocialNetwork.update({
        where: {
          id,
        },
        data: {
          ...updateSocialNetworkTypesDto,
        },
      });

    return plainToInstance(SocialNetworkTypesDto, updateSocialNetworkTypes);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.typeSocialNetwork.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
