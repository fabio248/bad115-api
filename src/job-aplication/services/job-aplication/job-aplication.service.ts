import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JobAplicationDto } from 'src/job-aplication/dto/response/job-aplication.dto';
import { plainToInstance } from 'class-transformer';
import { CreateJobAplicationDto } from 'src/job-aplication/dto/request/create-job-aplication.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from 'src/files/services/files.service';
import { MailAlertMeetingTemplateData } from 'src/common/types/mail.types';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from 'src/common/events/mail.event';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobAplicationService {
  private readonly logger = new Logger(JobAplicationService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(
    id: string,
    jobId: string,
    createJobAplicationDto: CreateJobAplicationDto,
  ): Promise<JobAplicationDto> {
    const { mimeTypeFile, status, ...createData } = createJobAplicationDto;
    this.logger.log('creating a new job aplication');
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
      },
      include: {
        person: {
          include: {
            user: true,
          },
        },
      },
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

    const jobApplicationData: Prisma.JobApplicationCreateInput = {
      ...createData,
      candidate: {
        connect: {
          id: id,
        },
      },
      jobPosition: {
        connect: {
          id: jobId,
        },
      },
      status: '',
    };

    const [jobPosition, cv] = await this.prismaService.$transaction(
      async (tPrisma) => {
        if (!mimeTypeFile) {
          return [
            tPrisma.jobApplication.create({
              data: jobApplicationData,
            }),
          ];
        }

        const keyFile = `${uuidv4()}-jobAplication`;
        const file = await tPrisma.file.create({
          data: {
            name: keyFile,
          },
        });

        jobApplicationData['file'] = {
          connect: {
            id: file.id,
          },
        };
        // temporal eliminarlo
        const meeting = {
          executionDate: new Date(),
          link: 'https://meet.google.com/xxx-xxx-xxx',
        };

        if (status !== 'Contratado' && status !== 'Descartado') {
          const mailBody: MailAlertMeetingTemplateData = {
            dynamicTemplateData: {
              userEmail: candidate.person.user.email,
              userName: `${candidate.person.firstName} ${candidate.person.lastName}`,
              date: meeting.executionDate,
              positionName: 'EMPRESA VALIMOS VERGA',
              link: meeting.link,
            },
            from: this.configService.get('app.sendgrid.email'),
            templateId: this.configService.get(
              'app.sendgrid.templates.confirmationMeet',
            ),
            to: candidate.person.user.email,
          };

          await this.eventEmitter.emitAsync(SEND_EMAIL_EVENT, mailBody);
        }

        return Promise.all([
          tPrisma.jobApplication.create({
            data: jobApplicationData,
          }),
          this.filesService.getSignedUrlForFileUpload({
            key: keyFile,
            folderName: candidate.id,
            mimeType: mimeTypeFile,
          }),
        ]);
      },
    );

    return plainToInstance(JobAplicationDto, { ...jobPosition, cv });
  }

  async findOne(id: string): Promise<JobAplicationDto> {
    const jobAplication = await this.prismaService.jobApplication.findFirst({
      where: {
        id: id,
      },
      include: {
        meeting: true,
        file: true,
        candidate: true,
      },
    });

    if (!jobAplication) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.TEST'),
          },
        }),
      );
    }

    let cv = null;

    if (jobAplication.file) {
      cv = await this.filesService.getSignedUrlForFileRetrieval({
        keyNameFile: jobAplication.file.name,
        folderName: jobAplication.candidate.id,
      });
    }

    return plainToInstance(JobAplicationDto, { ...jobAplication, cv });
  }
}
