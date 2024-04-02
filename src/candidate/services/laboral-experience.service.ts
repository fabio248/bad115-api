import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';

//dto's
import { CreateLaboralExperienceDto } from '../dto/request/create-laboral-experience.dto';
import { LaboralExperienceDto } from '../dto/response/laboral-experience.dto';
import { UpdateLaboralExperienceDto } from '../dto/request/update-laboral-expirence.dto';
//paginated
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';

@Injectable()
export class LaboralExperienceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createLaboralExperienceDto: CreateLaboralExperienceDto,
    id: string,
  ): Promise<LaboralExperienceDto> {
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
    const { organizationContact } = createLaboralExperienceDto;
    const laboralExperience = this.prismaService.laboralExperience.create({
      data: {
        ...createLaboralExperienceDto,
        organizationContact: {
          create: organizationContact,
        },
        candidate: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(LaboralExperienceDto, laboralExperience);
  }

  async findOne(id: string): Promise<LaboralExperienceDto> {
    const laboralExperience =
      await this.prismaService.laboralExperience.findFirst({
        where: { id: id },
        include: {
          organizationContact: true,
        },
      });
    if (!laboralExperience) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LABORAL_EXPERIENCE'),
          },
        }),
      );
    }
    return plainToInstance(LaboralExperienceDto, laboralExperience);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<LaboralExperienceDto>> {
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
      },
    });
    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LABORAL_EXPERIENCE'),
          },
        }),
      );
    }
    const { skip, take } = getPaginationParams(pageDto);
    const [allLaboralExperience, totalItems] = await Promise.all([
      this.prismaService.laboralExperience.findMany({
        skip,
        take,
        where: {
          candidateId: id,
        },
        include: {
          organizationContact: true,
        },
      }),
      this.prismaService.laboralExperience.count({
        skip,
        take,
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);

    return {
      data: plainToInstance(LaboralExperienceDto, allLaboralExperience),
      pagination,
    };
  }

  async update(
    updateLaboralExperienceDto: UpdateLaboralExperienceDto,
    id: string,
    canid: string,
  ) {
    const laboralExperience = this.findOne(id);
    if (!laboralExperience) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.LABORAL_EXPERIENCE'),
          },
        }),
      );
    }
    const { organizationContact } = updateLaboralExperienceDto;
    const updateLaboralExperience =
      await this.prismaService.laboralExperience.update({
        where: {
          id,
        },
        data: {
          ...updateLaboralExperienceDto,
          organizationContact: {
            create: organizationContact,
          },
          candidate: {
            connect: {
              id: canid,
            },
          },
        },
      });

    return plainToInstance(LaboralExperienceDto, updateLaboralExperience);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.laboralExperience.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
