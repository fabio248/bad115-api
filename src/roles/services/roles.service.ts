import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/request/create-role.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from '../dto/response/role.dto';
import { I18nService } from 'nestjs-i18n';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDto> {
    const existRole = await this.findOneWithoutException({
      name: createRoleDto.name,
    });

    if (existRole) {
      throw new ConflictException(
        this.i18n.t('exception.CONFLICT.ROLE_NAME_ALREADY_TAKEN'),
      );
    }

    const role = await this.prismaService.role.create({
      data: createRoleDto,
    });

    return plainToInstance(RoleDto, role);
  }

  async findAll(): Promise<RoleDto[]> {
    const roles = await this.prismaService.role.findMany();

    return plainToInstance(RoleDto, roles);
  }

  async findOne(id: string): Promise<RoleDto> {
    const role = await this.prismaService.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.USER'),
          },
        }),
      );
    }

    return plainToInstance(RoleDto, role);
  }

  async findOneWithoutException(
    input: Prisma.RoleWhereUniqueInput,
  ): Promise<RoleDto> {
    const role = await this.prismaService.role.findUnique({
      where: input,
    });

    return plainToInstance(RoleDto, role);
  }
}
