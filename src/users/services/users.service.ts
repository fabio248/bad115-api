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
import { User } from '@prisma/client';
import { UpdateUserDto } from '../dtos/request/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
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

    const user = await this.prismaService.user.create({
      data: createUserDto,
    });

    return plainToInstance(UserDto, user);
  }

  async findOne(id: string) {
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

  async findOneByEmail(email: string): Promise<User> {
    this.logger.log('findOneByEmail');
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
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
