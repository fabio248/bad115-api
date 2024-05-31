import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { ParticipationTypesDto } from '../dtos/response/participation-types.dto';
import { CreateParticipationTypesDto } from '../dtos/request/create-participation-types.dto';
import { I18nService } from 'nestjs-i18n';
import { UpdateParticipationTypeDto } from '../dtos/request/update-participation-type.dto';

@Injectable()
export class ParticipationTypesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createParticipationTypesDto: CreateParticipationTypesDto,
  ): Promise<ParticipationTypesDto> {
    const participationType = await this.prismaService.participacionType.create(
      {
        data: {
          ...createParticipationTypesDto,
        },
      },
    );
    return plainToInstance(ParticipationTypesDto, participationType);
  }

  async findOne(id: string): Promise<ParticipationTypesDto> {
    const participationType =
      await this.prismaService.participacionType.findUnique({
        where: {
          id,
        },
      });

    if (!participationType) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PARTICIPATION_TYPE'),
          },
        }),
      );
    }
    return plainToInstance(ParticipationTypesDto, participationType);
  }

  async findAll(): Promise<ParticipationTypesDto[]> {
    const participationTypes =
      await this.prismaService.participacionType.findMany();

    return plainToInstance(ParticipationTypesDto, participationTypes);
  }

  async update(
    id: string,
    updateParticipationTypeDto: UpdateParticipationTypeDto,
  ): Promise<ParticipationTypesDto> {
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
    const updateParticipationType =
      await this.prismaService.participacionType.update({
        where: {
          id,
        },
        data: {
          ...updateParticipationTypeDto,
        },
      });

    return plainToInstance(ParticipationTypesDto, updateParticipationType);
  }
  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.participacionType.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
