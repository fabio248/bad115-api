import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dtos/response/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const existingUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

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
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return plainToInstance(UserDto, user);
  }
}
