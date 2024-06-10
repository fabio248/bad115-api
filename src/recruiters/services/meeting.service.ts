import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { MailAlertMeetingTemplateData } from 'src/common/types/mail.types';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from 'src/common/events/mail.event';

import { format, subDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class MeetingService {
  private readonly logger = new Logger(MeetingService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(
    id: string,
    createMeetingAplicationDto: CreateMeetingAplicationDto,
  ): Promise<MeetingDto> {
    this.logger.log('Creating Meeting for recruiter');
    const dateNow = new Date();
    const date = new Date(createMeetingAplicationDto.executionDate);

    if (dateNow.toLocaleString()[0] != date.toLocaleString()) [0];
    {
      const meeting = await this.prismaService.$transaction(async (prisma) => {
        const createdMeeting = await prisma.meeting.create({
          data: {
            ...createMeetingAplicationDto,
            jobAplication: {
              connect: {
                id: id,
              },
            },
          },
        });
        await this.SendScheduledEmail(id, createMeetingAplicationDto);
        return createdMeeting;
      });
      this.addCronJob(`cronjob${id}${id}`, id, createMeetingAplicationDto);
      return plainToInstance(MeetingDto, meeting);
    }
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
            candidate: {
              where: {
                deletedAt: null,
              },
            },
            jobPosition: true,
            file: {
              where: {
                deletedAt: null,
              },
            },
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
    createJobAplicationDto: CreateMeetingAplicationDto,
    id: string,
    meetId: string,
  ): Promise<MeetingDto> {
    this.logger.log('update informacion of meetings');
    const meeting = await this.findOne(meetId);
    if (!meeting) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.MEETING'),
          },
        }),
      );
    }
    if (meeting.executionDate !== createJobAplicationDto.executionDate) {
      this.addCronJob(`cronjob${meeting.id}${id}`, id, createJobAplicationDto);
    }
    const updateMeeting = await this.prismaService.meeting.update({
      where: {
        id: meetId,
      },
      data: {
        ...createJobAplicationDto,
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

  addCronJob(
    name: string,
    id: string,
    createMeetingAplicationDto: CreateMeetingAplicationDto,
  ) {
    const newDay = subDays(createMeetingAplicationDto.executionDate, 1);
    const formattedDate = `${format(new Date(newDay), 'dd/MM/yyyy')} ${format(
      new Date(createMeetingAplicationDto.executionDate),
      'hh:mm',
    )}`;

    const newformat = formattedDate.split('/');

    const dateCronJob = `0 ${newformat[2].split(' ')[1].split(':')[1]} ${
      newformat[2].split(' ')[1].split(':')[0]
    } ${newformat[0]} ${newformat[1]} *`;
    const job = new CronJob(`${dateCronJob}`, async () => {
      this.logger.warn(
        `time ${createMeetingAplicationDto.executionDate} for job ${name} to run!`,
      );

      await this.SendScheduledEmail(id, createMeetingAplicationDto);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  async SendScheduledEmail(
    id: string,
    createMeetingAplicationDto: CreateMeetingAplicationDto,
  ) {
    const { jobAplication } = await this.prismaService.$transaction(
      async (prisma) => {
        const jobAplication = await prisma.jobApplication.findUnique({
          where: {
            id: id,
            deletedAt: null,
          },
          include: {
            jobPosition: {
              include: {
                recruiter: {
                  include: {
                    person: {
                      include: {
                        user: true,
                      },
                    },
                  },
                  where: {
                    deletedAt: null,
                  },
                },
              },
            },
            candidate: {
              include: {
                person: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        });

        if (
          !jobAplication ||
          jobAplication.jobPosition.deletedAt ||
          jobAplication.jobPosition.recruiter.deletedAt ||
          jobAplication.jobPosition.recruiter.person.deletedAt ||
          jobAplication.jobPosition.recruiter.person.user.deletedAt ||
          jobAplication.candidate.deletedAt ||
          jobAplication.candidate.person.deletedAt ||
          jobAplication.candidate.person.user.deletedAt
        ) {
          throw new NotFoundException(
            this.i18n.t('exception.NOT_FOUND.DEFAULT', {
              args: {
                entity: this.i18n.t('entities.JOB_APPLICATION'),
              },
            }),
          );
        }
        return { jobAplication };
      },
    );

    if (
      jobAplication.candidate.person.user.email !=
      jobAplication.jobPosition.recruiter.person.user.email
    ) {
      if (
        jobAplication.jobPosition.status !== 'Contratado' &&
        jobAplication.jobPosition.status !== 'Descartado'
      ) {
        const formattedDate = `${format(
          new Date(createMeetingAplicationDto.executionDate),
          'dd/MM/yyyy',
        )} a las ${format(
          new Date(createMeetingAplicationDto.executionDate),
          'hh:mm aa',
          {
            locale: enUS,
          },
        )}`;

        const mailBodyCandidate: MailAlertMeetingTemplateData = {
          dynamicTemplateData: {
            userEmail: jobAplication.candidate.person.user.email,
            userName: `${jobAplication.candidate.person.firstName} ${jobAplication.candidate.person.lastName}`,
            date: formattedDate,
            positionName: jobAplication.jobPosition.name,
            link: createMeetingAplicationDto.link,
          },
          from: this.configService.get('app.sendgrid.email'),
          templateId: this.configService.get(
            'app.sendgrid.templates.confirmationMeet',
          ),
          to: jobAplication.candidate.person.user.email,
        };
        const mailBodyRecruiter: MailAlertMeetingTemplateData = {
          dynamicTemplateData: {
            userEmail: jobAplication.jobPosition.recruiter.person.user.email,
            userName: `${jobAplication.jobPosition.recruiter.person.firstName} ${jobAplication.jobPosition.recruiter.person.lastName}`,
            date: formattedDate,
            positionName: jobAplication.jobPosition.name,
            link: createMeetingAplicationDto.link,
          },
          from: this.configService.get('app.sendgrid.email'),
          templateId: this.configService.get(
            'app.sendgrid.templates.confirmationMeet',
          ),
          to: jobAplication.jobPosition.recruiter.person.user.email,
        };

        await this.eventEmitter.emitAsync(SEND_EMAIL_EVENT, mailBodyCandidate);
        await this.eventEmitter.emitAsync(SEND_EMAIL_EVENT, mailBodyRecruiter);
      }
    } else {
      throw new BadRequestException(
        this.i18n.t('exception.CONFLICT.EMAILS_EQUALS', {
          args: {
            entity: this.i18n.t('entities.EMAILS'),
          },
        }),
      );
    }
  }
}
