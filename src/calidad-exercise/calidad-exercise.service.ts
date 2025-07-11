import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CandidateFilterByRangeDateDto } from './dtos/request/candidate-filter-by-range-date.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CalidadExerciseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async filterByRangeDate(
    candidateFilterByRangeDateDto: CandidateFilterByRangeDateDto,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: candidateFilterByRangeDateDto.email,
      },
      include: {
        person: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CANDIDATE'),
          },
        }),
      );
    }

    const candidate = await this.prismaService.candidate.findFirst({
      where: {
        id: user.person.candidateId,
        deletedAt: null,
      },
      include: {
        person: true,
        jobApplications: {
          where: {
            createdAt: {
              gte: candidateFilterByRangeDateDto.startDate
                ? new Date(candidateFilterByRangeDateDto.startDate)
                : undefined,
              lte: candidateFilterByRangeDateDto.endDate
                ? new Date(candidateFilterByRangeDateDto.endDate)
                : undefined,
            },
          },
          include: {
            jobPosition: true,
          },
        },
      },
    });

    return candidate;
  }
}
