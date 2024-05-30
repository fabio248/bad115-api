import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CandidateDto } from '../dto/response/candidate.dto';
import { PrismaService } from 'nestjs-prisma';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { CandidateFilterDto } from '../dto/request/candidate-filter.dto';
import { Prisma } from '@prisma/client';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CandidateService {
  private readonly logger = new Logger(CandidateService.name);
  private includeCandidate: Prisma.CandidateInclude = {
    person: {
      include: {
        address: {
          include: {
            country: true,
            municipality: true,
            department: true,
          },
        },
        user: true,
        documents: true,
        socialNetwork: true,
      },
    },
    academicKnowledges: true,
    certifications: true,
    technicalSkills: true,
    tests: true,
    laboralExperiences: true,
    languageSkills: true,
    participations: true,
    publications: true,
    recognitions: true,
    recomendations: true,
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async findOne(id: string): Promise<CandidateDto> {
    this.logger.log(`Finding candidate with id: ${id}`);
    const candidate = await this.prismaService.candidate.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
      include: this.includeCandidate,
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
    return plainToInstance(CandidateDto, candidate);
  }

  async findAll(
    pageDto: PageDto,
    candidateFilterDto: CandidateFilterDto,
  ): Promise<PaginatedDto<CandidateDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const { search } = candidateFilterDto;
    const whereInput: Prisma.CandidateWhereInput = {
      deletedAt: null,
    };

    if (search) {
      const searchParams = search.split(' ');

      whereInput.OR = searchParams.map((param) => ({
        person: {
          OR: [
            { firstName: { contains: param } },
            { lastName: { contains: param } },
            { middleName: { contains: param } },
            { secondLastName: { contains: param } },
          ],
        },
      }));
    }

    const [candidates, totalItems] = await Promise.all([
      this.prismaService.candidate.findMany({
        take,
        skip,
        where: whereInput,
        include: {
          person: {
            include: {
              user: true,
            },
          },
        },
      }),
      this.prismaService.candidate.count({
        where: whereInput,
      }),
    ]);
    return {
      data: plainToInstance(CandidateDto, candidates),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }
}
