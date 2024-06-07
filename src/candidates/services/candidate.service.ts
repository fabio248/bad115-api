import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CandidateDto } from '../dto/response/candidate.dto';
import { PrismaService } from 'nestjs-prisma';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { CandidateFilterDto } from '../dto/request/candidate-filter.dto';
import { Candidate, Prisma } from '@prisma/client';
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

      const searchQuery = Prisma.sql([
        searchParams
          .map(
            (param, index) =>
              `CASE
                WHEN person.primer_nombre LIKE '%${param}%' THEN ${index + 1}
                WHEN person.segundo_nombre LIKE '%${param}%' THEN ${index + 1}
                WHEN person.primer_apellido LIKE '%${param}%' THEN ${index + 1}
                WHEN person.segundo_apellido LIKE '%${param}%' THEN ${index + 1}
                ELSE 0
              END`,
          )
          .join(' + '),
      ]);

      const [rawCandidates, totalItems] = await Promise.all([
        this.prismaService.$queryRaw<any[]>`
            SELECT person.id,
                   person.fecha_nacimiento as "birthday",
                   person.primer_nombre    as "firstName",
                   person.segundo_nombre   as "middleName",
                   person.primer_apellido  as "lastName",
                   person.segundo_apellido as "secondLastName",
                   person.genero           as "gender",
                   person.telefono         as "phone",
                   person.userId,
                   person.candidateId,
                   person.recruiterId,
                   usuario.correo          as "email",
                   usuario.avatar          as "avatar",
                   (${searchQuery})        as score
            FROM mnt_cantidato candidate
                    LEFT JOIN mnt_persona person ON candidate.id = person.candidateId
                    JOIN mnt_usuario usuario ON person.userId = usuario.id
            WHERE candidate.eliminado_en IS NULL
              AND ${searchQuery} > 0
            ORDER BY score DESC
            OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY
        `,
        this.prismaService.candidate.count({
          where: whereInput,
        }),
      ]);

      const candidates = rawCandidates.map((rawCandidate) => ({
        id: rawCandidate.candidateId,
        person: {
          id: rawCandidate.id,
          firstName: rawCandidate.firstName,
          middleName: rawCandidate.middleName,
          lastName: rawCandidate.lastName,
          secondLastName: rawCandidate.secondLastName,
          birthday: rawCandidate.birthday,
          gender: rawCandidate.gender,
          candidateId: rawCandidate.candidateId,
          recruiterId: rawCandidate.recruiterId,
          userId: rawCandidate.userId,
          user: {
            id: rawCandidate.userId,
            email: rawCandidate.email,
            avatar: rawCandidate.avatar,
          },
        },
      }));

      return {
        data: plainToInstance(CandidateDto, candidates),
        pagination: getPaginationInfo(pageDto, totalItems),
      };
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
      data: plainToInstance(CandidateDto, candidates as Array<Candidate>),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }
}
