import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JobAplicationDto } from 'src/job-aplication/dto/response/job-aplication.dto';
import { plainToInstance } from 'class-transformer';
import { CreateJobAplicationDto } from 'src/job-aplication/dto/request/create-job-aplication.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from 'src/files/services/files.service';
import {
  MailAlertJobPositionCandidateTemplateData,
  MailAlertJobPositionRecruiterTemplateData,
} from 'src/common/types/mail.types';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from 'src/common/events/mail.event';
import { Prisma } from '@prisma/client';
import { JobAplicationUpdateDto } from 'src/job-aplication/dto/request/job-apication-update.dto';

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
    const { mimeTypeFile, ...createData } = createJobAplicationDto;
    this.logger.log('creating a new job aplication');

    const { candidate, jobApplicationData } =
      await this.prismaService.$transaction(async (prisma) => {
        const candidate = await prisma.candidate.findUnique({
          where: {
            id: id,
          },
          include: {
            jobApplications: {
              include: {
                jobPosition: {
                  include: {
                    company: true,
                    recruiter: {
                      include: {
                        person: {
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
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
          status: createJobAplicationDto.status,
        };
        return { candidate, jobApplicationData };
      });

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
        if (
          candidate.person.user.email !=
          candidate.jobApplications[0].jobPosition.recruiter.person.user.email
        ) {
          const mailBodyRecruiter: MailAlertJobPositionRecruiterTemplateData = {
            dynamicTemplateData: {
              recruiterName: `${candidate.jobApplications[0].jobPosition.recruiter.person.firstName} ${candidate.jobApplications[0].jobPosition.recruiter.person.lastName} `,
              positionName: candidate.jobApplications[0].jobPosition.name,
              candidateName: `${candidate.person.firstName} ${candidate.person.lastName}`,
              candidateEmail: candidate.person.user.email,
            },
            from: this.configService.get('app.sendgrid.email'),
            templateId: this.configService.get(
              'app.sendgrid.templates.notificationNewJobAplicationRecruiter',
            ),
            to: candidate.jobApplications[0].jobPosition.recruiter.person.user
              .email,
          };
          const mailBodyCandidate: MailAlertJobPositionCandidateTemplateData = {
            dynamicTemplateData: {
              userName: `${candidate.person.firstName} ${candidate.person.lastName}`,
              positionName: candidate.jobApplications[0].jobPosition.name,
              companyName:
                candidate.jobApplications[0].jobPosition.company.name,
            },
            from: this.configService.get('app.sendgrid.email'),
            templateId: this.configService.get(
              'app.sendgrid.templates.notificationNewJobAplicationCandidate',
            ),
            to: candidate.person.user.email,
          };

          await this.eventEmitter.emitAsync(
            SEND_EMAIL_EVENT,
            mailBodyCandidate,
          );
          await this.eventEmitter.emitAsync(
            SEND_EMAIL_EVENT,
            mailBodyRecruiter,
          );
        } else {
          throw new BadRequestException(
            this.i18n.t('exception.CONFLICT.EMAILS_EQUALS', {
              args: {
                entity: this.i18n.t('entities.EMAILS'),
              },
            }),
          );
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
        deletedAt: null,
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
            entity: this.i18n.t('entities.JOB_APPLICATION'),
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

  async update(
    id: string,
    updateJobAplication: JobAplicationUpdateDto,
  ): Promise<JobAplicationDto> {
    const findJobAplication = await this.findOne(id);

    if (!findJobAplication) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.JOB_APPLICATION'),
          },
        }),
      );
    }
    const jobAplication = await this.prismaService.jobApplication.update({
      where: {
        id: id,
      },
      data: {
        ...updateJobAplication,
      },
    });

    return plainToInstance(JobAplicationDto, { ...jobAplication });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prismaService.jobApplication.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
