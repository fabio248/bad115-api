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
import { JobPositionFilterDto } from '../dtos/request/job-position-filter.dto';
import { JobPositionCountDto } from '../dtos/response/job-position-count.dto';
import { StatusEnum } from '../enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RECOMMENDED_JOB_POSITION } from '../../common/events/recommended-job-position.event';

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
      where: { deletedAt: null },
      include: {
        language: true,
      },
    },
    technicalSkills: {
      where: { deletedAt: null },
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
    private readonly eventEmitter: EventEmitter2,
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
                numberHouse: address?.numberHouse,
                street: address?.street,
                country: { connect: { id: address?.countryId } },
                department: address?.departmentId
                  ? { connect: { id: address?.departmentId } }
                  : undefined,
                municipality: address?.municipalityId
                  ? { connect: { id: address?.municipalityId } }
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

    this.eventEmitter.emit(RECOMMENDED_JOB_POSITION, jobPosition.id);

    return plainToInstance(JobPositionDto, jobPosition);
  }

  async calculatePercentageMatchCandidateJobPosition(
    jobPositionId: string,
    whereInput: Prisma.CandidateWhereInput = {},
  ) {
    const jobPosition = await this.prismaService.jobPosition.findUnique({
      where: {
        id: jobPositionId,
      },
      include: {
        technicalSkills: {
          include: {
            technicalSkill: {
              include: {
                categoryTechnicalSkill: true,
              },
            },
          },
        },
        languageSkills: {
          include: {
            language: true,
          },
        },
      },
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

    const candidates = await this.prismaService.candidate.findMany({
      where: {
        ...whereInput,
        deletedAt: null,
      },
      include: {
        person: {
          include: {
            user: true,
          },
        },
        technicalSkills: {
          where: {
            deletedAt: null,
          },
          include: {
            technicalSkill: {
              include: {
                categoryTechnicalSkill: true,
              },
            },
          },
        },
        languageSkills: {
          where: {
            deletedAt: null,
          },
          include: {
            language: true,
          },
        },
      },
    });

    const totalSkills =
      jobPosition.technicalSkills.length + jobPosition.languageSkills.length;

    const candidatesMatched = candidates.map((candidate) => {
      const numberMatchedSkills =
        candidate.technicalSkills.filter((candidateSkill) => {
          return jobPosition.technicalSkills.some((jobPositionSkill) => {
            return (
              jobPositionSkill.technicalSkillId ===
              candidateSkill.technicalSkillId
            );
          });
        }).length +
        candidate.languageSkills.filter((candidateSkill) => {
          return jobPosition.languageSkills.some((jobPositionSkill) => {
            return (
              jobPositionSkill.languageId === candidateSkill.languageId &&
              jobPositionSkill.skill === candidateSkill.skill &&
              this.compareLanguageLevel(
                candidateSkill.level,
                jobPositionSkill.level,
              )
            );
          });
        }).length;

      return {
        percentage: +(numberMatchedSkills / totalSkills).toFixed(2),
        candidate,
      };
    });

    return candidatesMatched;
  }

  compareLanguageLevel(languageLevelA: string, languageLevelB: string) {
    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return (
      languageLevels.indexOf(languageLevelA) >=
      languageLevels.indexOf(languageLevelB)
    );
  }

  async findAll(
    pageDto: PageDto,
    {
      countryId,
      departmentId,
      name,
      experiencesLevel,
      workday,
      modality,
      contractType,
      companyId,
    }: JobPositionFilterDto = {},
  ): Promise<PaginatedDto<JobPositionDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const whereInput: Prisma.JobPositionWhereInput = {
      deletedAt: null,
    };

    if (name) {
      whereInput.name = {
        contains: name,
      };
    }

    if (companyId) {
      whereInput.companyId = companyId;
    }

    if (countryId || departmentId) {
      whereInput.AND = [
        { address: { isNot: null } },
        {
          address: {
            countryId: countryId,
            departmentId: departmentId,
          },
        },
      ];
    }

    if (experiencesLevel.length > 0) {
      whereInput.experiencesLevel = {
        in: Array.isArray(experiencesLevel)
          ? experiencesLevel
          : [experiencesLevel],
      };
    }

    if (workday.length > 0) {
      whereInput.workday = {
        in: Array.isArray(workday) ? workday : [workday],
      };
    }

    if (modality.length > 0) {
      whereInput.modality = {
        in: Array.isArray(modality) ? modality : [modality],
      };
    }

    if (contractType.length > 0) {
      whereInput.contractType = {
        in: Array.isArray(contractType) ? contractType : [contractType],
      };
    }

    const [jobPositions, totalItems] = await Promise.all([
      this.prismaService.jobPosition.findMany({
        where: whereInput,
        skip,
        take,
        include: this.include,
      }),
      this.prismaService.jobPosition.count({
        where: whereInput,
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
    const jobApplicationCount = await this.prismaService.jobApplication.count({
      where: {
        jobPositionId: id,
        deletedAt: null,
      },
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

    return plainToInstance(JobPositionDto, {
      ...jobPosition,
      jobApplicationCount,
    });
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
                jobPosition: { connect: { id } },
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

  async findAllJob(): Promise<JobPositionCountDto> {
    const [countActive, countInactive] = await Promise.all([
      this.prismaService.jobPosition.count({
        where: {
          status: StatusEnum.ACTIVE,
        },
      }),
      this.prismaService.jobPosition.count({
        where: {
          status: StatusEnum.INACTIVE,
        },
      }),
    ]);

    const result = {
      countActive,
      countInactive,
    };

    return plainToInstance(JobPositionCountDto, result);
  }
}
