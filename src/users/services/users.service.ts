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
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { roles } from '../../../prisma/seeds/roles.seed';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from '../../common/events/mail.event';
import { ConfigService } from '@nestjs/config';
import { CreateRegisterDto } from '../../auth/dtos/request/create-register.dto';
import { CreatePersonDto } from '../../persons/dtos/request/create-person.dto';
import { RegisterDto } from '../../auth/dtos/response/register.dto';

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
        const [user, candidate, recruiter] = await Promise.all([
          tPrisma.user.create({
            data: {
              email: registerDto.email,
              password: registerDto.password,
            },
          }),
          tPrisma.candidate.create({ data: {} }),
          tPrisma.recruiter.create({ data: {} }),
        ]);

        const createPersonDto = instanceToPlain(registerDto);
        delete createPersonDto.email;
        delete createPersonDto.password;

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

    return plainToInstance(UserDto, user);
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
}
