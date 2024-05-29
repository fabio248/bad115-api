import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/request/create-permission.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { PermissionDto } from '../dto/response/permission.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { I18nService } from 'nestjs-i18n';
import { UpdatePermissionDto } from '../dto/request/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    const permission = await this.prismaService.permission.create({
      data: createPermissionDto,
    });

    return plainToInstance(PermissionDto, permission);
  }

  async findAllPaginated(
    pageDto: PageDto,
  ): Promise<PaginatedDto<PermissionDto>> {
    const { skip, take } = getPaginationParams(pageDto);

    const [permissions, totalItems] = await Promise.all([
      this.prismaService.permission.findMany({
        skip,
        take,
        where: { deletedAt: null },
      }),
      this.prismaService.permission.count({ where: { deletedAt: null } }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return { data: plainToInstance(PermissionDto, permissions), pagination };
  }

  async findAll(): Promise<PermissionDto[]> {
    const permission = await this.prismaService.permission.findMany({
      where: { deletedAt: null },
    });

    return plainToInstance(PermissionDto, permission);
  }

  async findOne(id: string): Promise<PermissionDto> {
    const permission = await this.prismaService.permission.findUnique({
      where: { id, deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PERMISSION'),
          },
        }),
      );
    }

    return plainToInstance(PermissionDto, permission);
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    await this.findOne(id);

    const permission = await this.prismaService.permission.update({
      where: { id },
      data: updatePermissionDto,
    });

    return plainToInstance(PermissionDto, permission);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prismaService.permission.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
