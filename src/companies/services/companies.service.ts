import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from '../dtos/request/create-company.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CompanyDto } from '../dtos/response/company.dto';
import { roles } from '../../../prisma/seeds/roles.seed';
import { I18nService } from 'nestjs-i18n';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { UpdateCompanyDto } from '../dtos/request/update-company.dto';
import { UsersService } from '../../users/services/users.service';
import { AddRecruiterCompanyDto } from '../dtos/request/add-recruiter-company.dto';
import { PersonDto } from '../../persons/dtos/response/person.dto';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly usersServices: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    this.logger.log('create');
    const { email, password, countryId, ...createData } = createCompanyDto;

    const isEmailTaken = await this.usersServices.findOneByEmail(email);

    if (isEmailTaken) {
      throw new ConflictException(
        this.i18n.t('exception.CONFLICT.EMAIL_ALREADY_TAKEN', {
          args: { email },
        }),
      );
    }

    const company = await this.prismaService.$transaction(async (tPrisma) => {
      const company = await tPrisma.company.create({
        data: {
          ...createData,
          user: {
            create: {
              email,
              password,
            },
          },
          country: {
            connect: {
              id: countryId,
            },
          },
        },
        include: {
          user: true,
          country: true,
        },
      });

      await tPrisma.userRole.create({
        data: {
          user: {
            connect: {
              id: company.user.id,
            },
          },
          role: {
            connect: {
              name: roles.COMPANY,
            },
          },
        },
      });

      return company;
    });

    return plainToInstance(CompanyDto, company);
  }

  async findAll(pageDto: PageDto): Promise<PaginatedDto<CompanyDto>> {
    this.logger.log('findAll', pageDto);
    const { skip, take } = getPaginationParams(pageDto);

    const [companies, totalItems] = await Promise.all([
      this.prismaService.company.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
        include: {
          user: true,
          country: true,
        },
      }),
      this.prismaService.company.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: companies.map((company) => plainToInstance(CompanyDto, company)),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }

  async findOne(id: string) {
    this.logger.log('findOne', id);
    const company = await this.prismaService.company.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: true,
        country: true,
      },
    });

    if (!company) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.COMPANY'),
          },
        }),
      );
    }

    return plainToInstance(CompanyDto, company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    this.logger.log('update', id, updateCompanyDto);
    await this.findOne(id);

    const company = await this.prismaService.company.update({
      where: {
        id,
      },
      data: updateCompanyDto,
    });

    return plainToInstance(CompanyDto, company);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.company.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async addRecruiter(
    companyId: string,
    { email: emailRecruiter }: AddRecruiterCompanyDto,
  ) {
    this.logger.log('addRecruiter', companyId, emailRecruiter);
    const [user] = await Promise.all([
      this.usersServices.findOneByEmail(emailRecruiter, { person: true }),
      this.findOne(companyId),
    ]);

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.USER'),
          },
        }),
      );
    }

    const companyRecruiter =
      await this.prismaService.companyRecruiter.findFirst({
        where: {
          companyId,
          recruiterId: user.person.recruiterId,
          deletedAt: { not: null },
        },
        include: {
          company: true,
        },
      });

    if (companyRecruiter) {
      await Promise.all([
        this.prismaService.companyRecruiter.update({
          where: {
            id: companyRecruiter.id,
          },
          data: {
            deletedAt: null,
          },
        }),
        this.prismaService.company.update({
          where: {
            id: companyId,
          },
          data: {
            assignedRecruiter: companyRecruiter.company.assignedRecruiter + 1,
          },
        }),
      ]);
    } else {
      await this.prismaService.$transaction(async (tPrisma) => {
        await Promise.all([
          tPrisma.companyRecruiter.create({
            data: {
              company: {
                connect: {
                  id: companyId,
                },
              },
              recruiter: {
                connect: {
                  id: user.person.recruiterId,
                },
              },
            },
          }),
          tPrisma.userRole.create({
            data: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              role: {
                connect: {
                  name: roles.RECRUITER,
                },
              },
            },
          }),
        ]);
      });
    }
  }

  async findAllRecruiters(companyId: string, pageDto: PageDto) {
    this.logger.log('getRecruiters', companyId);
    const { skip, take } = getPaginationParams(pageDto);
    await this.findOne(companyId);

    const [recruiters, totalItems] = await Promise.all([
      this.prismaService.companyRecruiter.findMany({
        where: {
          companyId,
          deletedAt: null,
        },
        skip,
        take,
      }),
      this.prismaService.companyRecruiter.count({
        where: {
          companyId,
          deletedAt: null,
        },
      }),
    ]);

    const persons = await this.prismaService.person.findMany({
      where: {
        recruiterId: {
          in: recruiters.map((recruiter) => recruiter.recruiterId),
        },
      },
      include: {
        user: true,
        address: {
          include: {
            department: true,
            country: true,
            municipality: true,
          },
        },
        documents: true,
      },
    });

    return {
      data: plainToInstance(PersonDto, persons),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }

  async findOneRecruiter(companyId: string, recruiterId: string) {
    this.logger.log('findOneRecruiter', companyId, recruiterId);
    await this.findOne(companyId);

    const person = await this.prismaService.person.findFirst({
      where: {
        recruiterId,
      },
      include: {
        user: true,
        address: {
          include: {
            department: true,
            country: true,
            municipality: true,
          },
        },
        documents: true,
      },
    });

    if (!person) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECRUITER'),
          },
        }),
      );
    }

    return plainToInstance(PersonDto, person);
  }

  async removeRecruiter(companyId: string, recruiterId: string) {
    this.logger.log('removeRecruiter', companyId, recruiterId);
    const [person, companyRecruiter] = await Promise.all([
      this.prismaService.person.findFirst({
        where: {
          recruiterId,
          deletedAt: null,
        },
      }),
      this.prismaService.companyRecruiter.findFirst({
        where: {
          companyId,
          recruiterId,
          deletedAt: null,
        },
      }),
      this.findOne(companyId),
    ]);

    if (!person) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECRUITER'),
          },
        }),
      );
    }

    if (!companyRecruiter) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.RECRUITER'),
          },
        }),
      );
    }

    await this.prismaService.companyRecruiter.update({
      where: {
        id: companyRecruiter.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
