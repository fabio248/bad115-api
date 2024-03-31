import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/request/create-role.dto';

import { IdDto } from '../../common/dtos/id.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RoleDto } from '../dto/response/role.dto';

@Controller('roles')
@ApiTags('Roles Endpoints')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth({
    permissions: [permissions.CREATE_ROLE.codename],
  })
  @ApiErrorResponse({
    errors: [
      {
        status: HttpStatus.CONFLICT,
        message: 'El nombre del rol ya está en uso.',
        errorType: 'Conflict',
        path: 'roles',
      },
    ],
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Auth({
    permissions: [permissions.READ_ROLE.codename],
  })
  @Get()
  findAll(): Promise<RoleDto[]> {
    return this.rolesService.findAll();
  }

  @Auth({
    permissions: [permissions.READ_ROLE.codename],
  })
  @ApiErrorResponse({
    errors: [
      {
        status: HttpStatus.NOT_FOUND,
        message: 'Rol no encontrado.',
        errorType: 'Not Found',
        path: 'roles',
      },
    ],
  })
  @Get(':id')
  findOne(@Param() { id }: IdDto): Promise<RoleDto> {
    return this.rolesService.findOne(id);
  }
}
