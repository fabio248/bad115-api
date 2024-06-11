import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CompanyDto } from '../../companies/dtos/response/company.dto';
import { I18nService } from 'nestjs-i18n';
import { RecruiterDto } from '../dtos/response/recruiter.dto';
import { JobPositionDto } from '../../job-position/dtos/response/job-position.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';

@Injectable()
export class RecruitersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getRecruitersCompany(recruiterId: string) {
    const companies = await this.prismaService.companyRecruiter.findMany({
      where: {
        recruiterId,
      },
      include: {
        company: true,
      },
    });

    return plainToInstance(
      CompanyDto,
      companies.map((company) => company.company),
    );
  }

  async findOne(recruiterId: string) {
    const recruiter = await this.prismaService.recruiter.findUnique({
      where: {
        id: recruiterId,
      },
      include: {
        companies: {
          include: {
            company: true,
          },
        },
        person: true,
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

    const transformedRecruiter = {
      ...recruiter,
      companies: recruiter.companies.map((company) => company.company),
    };

    return plainToInstance(RecruiterDto, transformedRecruiter);
  }

  async findAllJobPositions(recruiterId: string, pageDto: PageDto) {
    const { skip, take } = getPaginationParams(pageDto);
    const recruiter = await this.findOne(recruiterId);

    const [jobPositions, totalItems] = await Promise.all([
      this.prismaService.jobPosition.findMany({
        where: {
          companyId: {
            in: recruiter.companies.map((company) => company.id),
          },
        },
        include: {
          company: true,
        },
        skip,
        take,
      }),
      this.prismaService.jobPosition.count({
        where: {
          companyId: {
            in: recruiter.companies.map((company) => company.id),
          },
        },
      }),
    ]);

    return {
      data: plainToInstance(JobPositionDto, jobPositions),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }
}
