import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JobAplicationDto } from 'src/job-application/dto/response/job-aplication.dto';
import { plainToInstance } from 'class-transformer';
import { CreateJobAplicationDto } from 'src/job-application/dto/request/create-job-aplication.dto';
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
import { UpdateJobApplicationDto } from 'src/job-application/dto/request/update-job-application.dto';
import { PageDto } from '../../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../../common/utils/pagination.utils';
import { JobApplicationFilterDto } from '../../dto/request/job-application-filter.dto';
import { DocumentTypeEnum } from '../../../persons/enums/document-type.enum';

@Injectable()
export class JobApplicationService {
  private readonly logger = new Logger(JobApplicationService.name);

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

    const { candidate, jobApplicationData, jobPositionInfo } =
      await this.prismaService.$transaction(async (prisma) => {
        const candidate = await prisma.candidate.findUnique({
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
        const jobPositionInfo = await prisma.jobPosition.findUnique({
          where: {
            id: jobId,
            deletedAt: null,
          },
          include: {
            recruiter: {
              include: {
                person: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            company: true,
          },
        });
        if (!jobPositionInfo) {
          throw new NotFoundException(
            this.i18n.t('exception.NOT_FOUND.DEFAULT', {
              args: {
                entity: this.i18n.t('entities.JOB_POSITION'),
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
        return { candidate, jobApplicationData, jobPositionInfo };
      });

    const [jobPosition, cv] = await this.prismaService.$transaction(
      async (tPrisma) => {
        if (!mimeTypeFile) {
          const jobApplication = await tPrisma.jobApplication.create({
            data: jobApplicationData,
          });
          return [jobApplication, ''];
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
          candidate.person.user.email ===
          jobPositionInfo.recruiter.person.user.email
        ) {
          throw new BadRequestException(
            this.i18n.t('exception.CONFLICT.EMAILS_EQUALS', {
              args: {
                entity: this.i18n.t('entities.EMAILS'),
              },
            }),
          );
        }
        const mailBodyRecruiter: MailAlertJobPositionRecruiterTemplateData = {
          dynamicTemplateData: {
            recruiterName: `${jobPositionInfo.recruiter.person.firstName} ${jobPositionInfo.recruiter.person.lastName} `,
            positionName: jobPositionInfo.name,
            candidateName: `${candidate.person.firstName} ${candidate.person.lastName}`,
            candidateEmail: candidate.person.user.email,
          },
          from: this.configService.get('app.sendgrid.email'),
          templateId: this.configService.get(
            'app.sendgrid.templates.notificationNewJobAplicationRecruiter',
          ),
          to: jobPositionInfo.recruiter.person.user.email,
        };
        const mailBodyCandidate: MailAlertJobPositionCandidateTemplateData = {
          dynamicTemplateData: {
            userName: `${candidate.person.firstName} ${candidate.person.lastName}`,
            positionName: jobPositionInfo.name,
            companyName: jobPositionInfo.company.name,
          },
          from: this.configService.get('app.sendgrid.email'),
          templateId: this.configService.get(
            'app.sendgrid.templates.notificationNewJobAplicationCandidate',
          ),
          to: candidate.person.user.email,
        };

        await this.eventEmitter.emitAsync(SEND_EMAIL_EVENT, mailBodyCandidate);
        await this.eventEmitter.emitAsync(SEND_EMAIL_EVENT, mailBodyRecruiter);

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

    return plainToInstance(JobAplicationDto, {
      ...jobPosition,
      cv,
    });
  }

  async findAllByJobPosition(
    jobPositionId: string,
    pageDto: PageDto,
    { name, dui, passport }: JobApplicationFilterDto,
  ) {
    const { skip, take } = getPaginationParams(pageDto);
    const whereInput: Prisma.JobApplicationWhereInput = {
      jobPositionId: jobPositionId,
      deletedAt: null,
    };

    if (name || dui || passport) {
      whereInput.AND = [];

      if (name) {
        const names = name.split(' ');

        names.forEach((name) => {
          whereInput.AND = [
            {
              OR: [
                {
                  candidate: {
                    person: {
                      firstName: {
                        contains: name,
                      },
                    },
                  },
                },
                {
                  candidate: {
                    person: {
                      secondLastName: {
                        contains: name,
                      },
                    },
                  },
                },
                {
                  candidate: {
                    person: {
                      middleName: {
                        contains: name,
                      },
                    },
                  },
                },
                {
                  candidate: {
                    person: {
                      lastName: {
                        contains: name,
                      },
                    },
                  },
                },
              ],
            },
          ];
        });
      }

      (whereInput.AND as Prisma.JobApplicationWhereInput[]).push(
        dui || passport
          ? {
              candidate: {
                person: {
                  AND: [
                    dui
                      ? {
                          documents: {
                            some: {
                              type: DocumentTypeEnum.DUI,
                              number: {
                                contains: dui,
                              },
                            },
                          },
                        }
                      : {},
                    passport
                      ? {
                          documents: {
                            some: {
                              type: DocumentTypeEnum.PASSPORT,
                              number: {
                                contains: passport,
                              },
                            },
                          },
                        }
                      : {},
                  ],
                },
              },
            }
          : {},
      );
    }

    const [jobApplications, totalItems] = await Promise.all([
      this.prismaService.jobApplication.findMany({
        where: whereInput,
        skip,
        take,
        include: {
          meeting: {
            where: { deletedAt: null },
          },
          file: true,
          candidate: {
            include: {
              person: {
                include: {
                  documents: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPositionId: jobPositionId,
          deletedAt: null,
        },
      }),
    ]);

    const jobApplicationsWithCv = [];

    for await (const jobApplication of jobApplications) {
      let cv = null;

      if (jobApplication.file) {
        cv = await this.filesService.getSignedUrlForFileRetrieval({
          keyNameFile: jobApplication.file.name,
          folderName: jobApplication.candidate.id,
        });
      }

      jobApplicationsWithCv.push(
        plainToInstance(JobAplicationDto, {
          ...jobApplication,
          cv,
        }),
      );
    }

    return {
      data: jobApplicationsWithCv,
      pagination: getPaginationInfo(pageDto, totalItems),
    };
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
    updateJobAplication: UpdateJobApplicationDto,
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
