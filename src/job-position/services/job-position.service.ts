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
import { UpdateJobPositionDto } from '../dtos/request/update-job-position.dto';
import { UpdateRequirementDto } from '../dtos/request/update-requeriments.dto';
import { UpdateTechnicalSkillsDto } from '../dtos/request/update-technical-skills.dto';
import { UpdateLanguageSkillsDto } from '../dtos/request/update-language-skills.dto';
import { UpdateAddressDto } from '../dtos/request/update-address.dto';
import { AddressesService } from '../../persons/services/addresses.service';

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
    languageSkills: {
      include: {
        language: true,
      },
    },
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
    private readonly addressesService: AddressesService,
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
    const recruiter = await this.prismaService.recruiter.findUnique({
      where: {
        id: recruiterId,
        deletedAt: null,
      },
    });

    if (!recruiter) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECRUITER'),
          },
        }),
      );
    }

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

  async update(
    id: string,
    updateJobPositionDto: UpdateJobPositionDto,
  ): Promise<JobPositionDto> {
    await this.findOne(id);

    const jobPosition = await this.prismaService.jobPosition.update({
      where: { id },
      data: updateJobPositionDto,
      include: this.include,
    });

    return plainToInstance(JobPositionDto, jobPosition);
  }

  async updateRequirements(
    id: string,
    updateRequirementDto: UpdateRequirementDto,
  ) {
    await this.findOne(id);

    await this.prismaService.$transaction(async (tPrisma) => {
      await tPrisma.requirement.deleteMany({
        where: {
          jobPositionId: id,
        },
      });

      await Promise.all(
        updateRequirementDto.requirements.map((requirement) =>
          tPrisma.requirement.create({
            data: {
              ...requirement,
              jobPosition: { connect: { id } },
            },
          }),
        ),
      );
    });
  }

  async updateTechnicalSkills(
    id: string,
    updateTechnicalSkillsDto: UpdateTechnicalSkillsDto,
  ) {
    await this.findOne(id);

    await this.prismaService.$transaction(async (tPrisma) => {
      await tPrisma.technicalSkillCandidate.deleteMany({
        where: {
          jobPositionId: id,
        },
      });

      await Promise.all(
        updateTechnicalSkillsDto.technicalSkills.map((technicalSkill) =>
          tPrisma.technicalSkillCandidate.create({
            data: {
              jobPosition: { connect: { id } },
              technicalSkill: {
                connect: {
                  id: technicalSkill.technicalSkillId,
                },
              },
            },
          }),
        ),
      );
    });
  }

  async updateLanguageSkills(
    id: string,
    updateLanguageSkillsDto: UpdateLanguageSkillsDto,
  ) {
    await this.findOne(id);

    await this.prismaService.$transaction(async (tPrisma) => {
      await tPrisma.languageSkill.deleteMany({
        where: {
          jobPositionId: id,
        },
      });

      await Promise.all(
        updateLanguageSkillsDto.languageSkills.map(
          ({ languageId, ...updateData }) =>
            tPrisma.languageSkill.create({
              data: {
                ...updateData,
                language: { connect: { id: languageId } },
                JobPosition: { connect: { id } },
              },
            }),
        ),
      );
    });
  }

  async updateAddress(
    id: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    await this.findOne(id);

    await this.addressesService.update(addressId, updateAddressDto);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.jobPosition.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
