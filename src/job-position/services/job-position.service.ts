import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateJobPositionDto } from '../dtos/request/create-job-position.dto';
import { plainToInstance } from 'class-transformer';
import { JobPositionDto } from '../dtos/response/job-position.dto';
import { Prisma } from '@prisma/client';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class JobPositionService {
  private readonly include: Prisma.JobPositionInclude = {
    address: {
      include: {
        country: true,
        department: true,
        municipality: true,
      },
    },
    requirements: true,
    languageSkills: true,
    technicalSkills: {
      include: {
        technicalSkill: true,
      },
    },
    company: true,
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    recruiterId: string,
    createJobPositionDto: CreateJobPositionDto,
  ) {
    const {
      address,
      requirements,
      languageSkills,
      technicalSkills,
      companyId,
      ...createData
    } = createJobPositionDto;

    const {
      countryId,
      departmentId,
      municipalityId,
      countryName,
      ...addressData
    } = address;

    countryName;

    const jobPosition = await this.prismaService.jobPosition.create({
      data: {
        ...createData,
        recruiter: {
          connect: {
            id: recruiterId,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
        address: address
          ? {
              create: {
                ...addressData,
                country: { connect: { id: countryId } },
                department: departmentId
                  ? { connect: { id: departmentId } }
                  : undefined,
                municipality: municipalityId
                  ? { connect: { id: municipalityId } }
                  : undefined,
              },
            }
          : undefined,
        requirements: { createMany: { data: requirements } },
        languageSkills: { createMany: { data: languageSkills } },
        technicalSkills: { createMany: { data: technicalSkills } },
      },
      include: this.include,
    });

    return plainToInstance(JobPositionDto, jobPosition);
  }

  async findAll(pageDto: PageDto): Promise<PaginatedDto<JobPositionDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const [jobPositions, totalItems] = await Promise.all([
      this.prismaService.jobPosition.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
        include: this.include,
      }),
      this.prismaService.jobPosition.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return { data: plainToInstance(JobPositionDto, jobPositions), pagination };
  }

  async findOne(id: string): Promise<JobPositionDto> {
    const jobPosition = await this.prismaService.jobPosition.findUnique({
      where: {
        id,
      },
      include: this.include,
    });

    if (!jobPosition) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.JOB_POSITION'),
          },
        }),
      );
    }

    return plainToInstance(JobPositionDto, jobPosition);
  }
}
