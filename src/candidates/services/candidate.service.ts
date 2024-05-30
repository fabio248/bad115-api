import { Injectable, Logger } from '@nestjs/common';
import { CandidateDto } from '../dto/response/candidate.dto';
import { PrismaService } from 'nestjs-prisma';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { CandidateFilterDto } from '../dto/request/candidate-filter.dto';
import { Prisma } from '@prisma/client';
import { getSortObject } from '../../common/utils/sort.utils';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { plainToInstance } from 'class-transformer';

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

  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string): Promise<CandidateDto> {
    this.logger.log(`Finding candidate with id: ${id}`);
    return;
  }

  async findAll(
    pageDto: PageDto,
    candidateFilterDto: CandidateFilterDto,
  ): Promise<PaginatedDto<CandidateDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const { search, sort } = candidateFilterDto;
    const whereInput: Prisma.CandidateWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereInput.person = {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
          {
            middleName: {
              contains: search,
            },
          },
          {
            secondLastName: {
              contains: search,
            },
          },
        ],
      };
    }

    const [candidates, totalItems] = await Promise.all([
      this.prismaService.candidate.findMany({
        take,
        skip,
        orderBy: getSortObject(sort),
        where: whereInput,
        include: this.includeCandidate,
      }),
      this.prismaService.candidate.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: plainToInstance(CandidateDto, candidates),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }
}
