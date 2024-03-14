import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from '../../common/guards/permission.guard';

interface IAuth {
  permissions?: string[];
  additionalGuards?: any[];
}

export function Auth({ permissions = [], additionalGuards = [] }: IAuth = {}) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(JwtAuthGuard, PermissionGuard, ...additionalGuards),
    ApiBearerAuth(),
  );
}
