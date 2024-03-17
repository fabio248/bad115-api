import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dtos/response/user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { roles } from '../../../prisma/seeds/roles.seed';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from '../../common/events/mail.event';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('create');
    const { email } = createUserDto;

    const existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        this.i18n.t('exception.CONFLICT.EMAIL_ALREADY_TAKEN', {
          args: { email },
          lang: I18nContext.current().lang,
        }),
      );
    }

    const user = await this.prismaService.$transaction(async (tPrisma) => {
      const user = await tPrisma.user.create({
        data: createUserDto,
      });

      await tPrisma.userRole.create({
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
      });

      return user;
    });

    this.eventEmitter.emit(SEND_EMAIL_EVENT, {
      to: user.email,
      from: this.configService.get('app.sendgrid.email'),
      templateId: this.configService.get('app.sendgrid.templates.welcome'),
    });

    return plainToInstance(UserDto, user);
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
}
