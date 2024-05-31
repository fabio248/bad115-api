import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/request/create-role.dto';

import { IdDto } from '../../common/dtos/request/id.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleDto } from '../dto/response/role.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { UpdateAssignPermissionDto } from '../dto/request/update-assign-permission.dto';

@Controller('roles')
@ApiTags('Roles Endpoints')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth({
    permissions: [permissions.CREATE_ROLE.codename],
  })
  @ApiErrorResponse([
    {
      status: HttpStatus.CONFLICT,
      message: 'El nombre del rol ya está en uso.',
      errorType: 'Conflict',
      path: 'roles',
    },
  ])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Auth({
    permissions: [permissions.READ_ROLE.codename],
  })
  @ApiPaginatedResponse(RoleDto)
  @Get('')
  findAll(@Query() pageDto: PageDto): Promise<PaginatedDto<RoleDto>> {
    return this.rolesService.findAll(pageDto);
  }

  @Auth({
    permissions: [permissions.READ_ROLE.codename],
  })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Rol no encontrado.',
      errorType: 'Not Found',
      path: 'roles',
    },
  ])
  @Get(':id')
  findOne(@Param() { id }: IdDto): Promise<RoleDto> {
    return this.rolesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar permisos asignados a un rol',
    description:
      'La forma en que funciona es que se envía un arreglo de permisos que se asignarán al rol. Si un permiso no está en el arreglo y ya se encuentra asignado, se eliminará. Si un permiso no está asignado, se asignará.',
  })
  @Auth({
    permissions: [permissions.UPDATE_ROLE.codename],
  })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Rol no encontrado.',
      errorType: 'Not Found',
      path: 'roles',
    },
  ])
  @Put(':id/permissions')
  update(
    @Param() { id }: IdDto,
    @Body() updateAssignPermissionDto: UpdateAssignPermissionDto,
  ): Promise<void> {
    return this.rolesService.updateAssignedPermissions(
      id,
      updateAssignPermissionDto,
    );
  }

  @Auth({ permissions: [permissions.DELETE_ROLE.codename] })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Rol no encontrado.',
      errorType: 'Not Found',
      path: 'roles',
    },
  ])
  @Delete(':id')
  async remove(@Param() { id }: IdDto): Promise<void> {
    return this.rolesService.remove(id);
  }
}
