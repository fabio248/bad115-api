import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserDto } from '../dtos/response/user.dto';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { roles } from '../../../prisma/seeds/roles.seed';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from '../../common/events/mail.event';
import { ConfigService } from '@nestjs/config';
import { CreateRegisterDto } from '../../auth/dtos/request/create-register.dto';
import { CreatePersonDto } from '../../persons/dtos/request/create-person.dto';
import { RegisterDto } from '../../auth/dtos/response/register.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from 'src/common/utils/pagination.utils';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UserFilterDto } from '../dtos/request/user-filter.dto';
import { getSortObject } from '../../common/utils/sort.utils';
import { defaultPrivacySettings } from '../interface/defaultPrivacySettings';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async create(registerDto: CreateRegisterDto) {
    this.logger.log('create');
    const { email } = registerDto;

    const existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        this.i18n.t('exception.CONFLICT.EMAIL_ALREADY_TAKEN', {
          args: { email },
          lang: I18nContext.current().lang,
        }),
      );
    }

    const [user, person] = await this.prismaService.$transaction(
      async (tPrisma) => {
        const [user, candidate, recruiter, privacySettings] = await Promise.all(
          [
            tPrisma.user.create({
              data: {
                email: registerDto.email,
                password: registerDto.password,
              },
            }),
            tPrisma.candidate.create({ data: {} }),
            tPrisma.recruiter.create({ data: {} }),
            tPrisma.privacySettings.create({
              data: {
                ...defaultPrivacySettings,
              },
            }),
          ],
        );

        const createPersonDto = instanceToPlain(registerDto);
        delete createPersonDto.email;
        delete createPersonDto.password;
        createPersonDto.privacySettings = {
          connect: {
            id: privacySettings.id,
          },
        };

        const [person] = await Promise.all([
          tPrisma.person.create({
            data: {
              ...(createPersonDto as CreatePersonDto),
              user: {
                connect: {
                  id: user.id,
                },
              },
              candidate: {
                connect: {
                  id: candidate.id,
                },
              },
              privacySettings: {
                connect: {
                  id: privacySettings.id,
                },
              },
              recruiter: {
                connect: {
                  id: recruiter.id,
                },
              },
            },
          }),
          tPrisma.userRole.create({
            data: {
              role: {
                connect: {
                  name: roles.USER,
                },
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          }),
        ]);

        return [user, person];
      },
    );

    this.eventEmitter.emit(SEND_EMAIL_EVENT, {
      to: user.email,
      from: this.configService.get('app.sendgrid.email'),
      templateId: this.configService.get('app.sendgrid.templates.welcome'),
    });

    return plainToInstance(RegisterDto, { ...user, id: person.id, ...person });
  }

  async findPermissions(userRolesId: string[]) {
    return this.prismaService.permission.findMany({
      where: {
        roles: {
          some: {
            roleId: { in: userRolesId },
          },
        },
      },
    });
  }

  async findRoles(userId: string) {
    return this.prismaService.role.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<UserDto> {
    this.logger.log('findOne');
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        person: true,
        company: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.USER'),
          },
        }),
      );
    }
    const [transformedUser] = this.transformUsers([user]);

    return plainToInstance(UserDto, transformedUser);
  }

  async findOneByEmail(email: string, include: Prisma.UserInclude = {}) {
    this.logger.log('findOneByEmail');
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
      include,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log('update');
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async findByRole(roles: string[]) {
    const roleIds = await this.prismaService.role.findMany({
      where: {
        name: {
          in: roles,
        },
      },
      select: {
        id: true,
      },
    });

    return this.prismaService.user.findMany({
      where: {
        roles: {
          some: {
            roleId: {
              in: roleIds.map((role) => role.id),
            },
          },
        },
      },
    });
  }

  async findAll(
    pageDto: PageDto,
    { sort, search }: UserFilterDto,
  ): Promise<PaginatedDto<UserDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const whereInput: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereInput.OR = [
        {
          email: {
            contains: search,
          },
        },
        {
          person: {
            firstName: {
              contains: search,
            },
          },
        },
        {
          person: {
            lastName: {
              contains: search,
            },
          },
        },
        {
          person: {
            middleName: {
              contains: search,
            },
          },
        },
        {
          person: {
            secondLastName: {
              contains: search,
            },
          },
        },
        {
          company: {
            name: {
              contains: search,
            },
          },
        },
      ];
    }

    const [users, totalItems] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take,
        where: whereInput,
        include: {
          person: true,
          company: true,
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: getSortObject(sort),
      }),
      this.prismaService.user.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: plainToInstance(UserDto, this.transformUsers(users)),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }

  transformUsers(users): Array<User> {
    return users.map(({ roles, ...user }) => ({
      ...user,
      roles: roles.map(({ role }) => ({
        ...role,
        permissions: role.permissions.map(
          (permission) => permission.permission,
        ),
      })),
    }));
  }
}
