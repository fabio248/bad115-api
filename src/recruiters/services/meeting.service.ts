import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMeetingAplicationDto } from '../dtos/request/create-meeting.dto';
import { MeetingDto } from '../dtos/response/meeting.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import {
  getPaginationInfo,
  getPaginationParams,
} from 'src/common/utils/pagination.utils';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { UpdateMeetingDto } from '../dtos/request/update-meeting.dto';

@Injectable()
export class MeetingService {
  private readonly logger = new Logger(MeetingService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    id: string,
    createMeetingAplicationDto: CreateMeetingAplicationDto,
  ): Promise<MeetingDto> {
    this.logger.log('Creating Meeting for recruiter');
    const jobAplication = await this.prismaService.jobApplication.findUnique({
      where: {
        id: id,
      },
    });
    if (!jobAplication) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.JOB_APPLICATION'),
          },
        }),
      );
    }
    const meeting = this.prismaService.meeting.create({
      data: {
        ...createMeetingAplicationDto,
        jobAplication: {
          connect: {
            id: id,
          },
        },
      },
    });
    return plainToInstance(MeetingDto, meeting);
  }

  async findOne(id: string): Promise<MeetingDto> {
    this.logger.log('Finding Participation content');
    const meeting = await this.prismaService.meeting.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        jobAplication: {
          include: {
            candidate: true,
            jobPosition: true,
            file: true,
          },
        },
      },
    });
    if (!meeting) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.MEETING'),
          },
        }),
      );
    }
    return plainToInstance(MeetingDto, meeting);
  }

  async findAll(
    id: string,
    pageDto: PageDto,
  ): Promise<PaginatedDto<MeetingDto>> {
    this.logger.log('Searching all meeting with base in job aplication');
    const jobAplication = await this.prismaService.jobApplication.findUnique({
      where: {
        id: id,
      },
    });
    if (!jobAplication) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.JOB_APPLICATION'),
          },
        }),
      );
    }
    const { skip, take } = getPaginationParams(pageDto);
    const [allMeeting, totalItems] = await Promise.all([
      this.prismaService.meeting.findMany({
        skip,
        take,
        where: {
          jobAplicationId: id,
          deletedAt: null,
        },
      }),
      this.prismaService.meeting.count({
        where: {
          jobAplicationId: id,
          deletedAt: null,
        },
      }),
    ]);
    const pagination = getPaginationInfo(pageDto, totalItems);
    return {
      data: plainToInstance(MeetingDto, allMeeting),
      pagination,
    };
  }

  async update(
    updateMeetingDto: UpdateMeetingDto,
    id: string,
    meetId: string,
  ): Promise<MeetingDto> {
    this.logger.log('update informacion of meetings');
    const meeting = this.findOne(meetId);
    if (!meeting) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.MEETING'),
          },
        }),
      );
    }

    const updateMeeting = await this.prismaService.meeting.update({
      where: {
        id: meetId,
      },
      data: {
        ...updateMeetingDto,
        jobAplication: {
          connect: { id },
        },
      },
    });
    return plainToInstance(MeetingDto, updateMeeting);
  }

  async remove(id: string) {
    this.logger.log('delete informacion of participation');
    await this.findOne(id);
    await this.prismaService.meeting.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
