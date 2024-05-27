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
import { UpdateAssignPermissionDto } from '../dto/request/update-assign-permission.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';

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

  async findAll(pageDto: PageDto): Promise<PaginatedDto<RoleDto>> {
    const { skip, take } = getPaginationParams(pageDto);

    const [roles, totalItems] = await Promise.all([
      this.prismaService.role.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
        skip,
        take,
      }),
      this.prismaService.role.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    const transformedRoles = roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((permission) => permission.permission),
    }));

    return { data: plainToInstance(RoleDto, transformedRoles), pagination };
  }

  async findOne(id: string): Promise<RoleDto> {
    const role = await this.prismaService.role.findUnique({
      where: {
        id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.ROLE'),
          },
        }),
      );
    }

    return plainToInstance(RoleDto, {
      ...role,
      permissions: role.permissions.map((permission) => permission.permission),
    });
  }

  async updateAssignedPermissions(
    id: string,
    updateAssignPermissionDto: UpdateAssignPermissionDto,
  ) {
    await this.findOne(id);
    const { permissionIds } = updateAssignPermissionDto;

    await this.prismaService.$transaction(async (tPrisma) => {
      await tPrisma.rolPermission.deleteMany({
        where: {
          roleId: id,
        },
      });

      await tPrisma.rolPermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        })),
      });
    });
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
