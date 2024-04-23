import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { permissions as permissionsList } from '../../../prisma/seeds/permissions.seed';

interface IAuth {
  permissions?: string[];
  additionalGuards?: any[];
}

export const Auth = ({
  permissions = [],
  additionalGuards = [],
}: IAuth = {}) => {
  const permissionsSet = new Set(permissions);
  const permissionsIntersection = Object.values(permissionsList).filter(
    (permission) => permissionsSet.has(permission.codename),
  );

  const requiresAdmin = permissionsIntersection.every(
    (permission) =>
      permission.roles.length === 1 && permission.roles[0] === 'admin',
  );

  const description = permissions.length
    ? `### Requiere los permisos: ${permissions.join(', ')}
    ${requiresAdmin ? ' - 🔒 Requiere privilegios de administrador' : ''}`
    : 'No requiere permisos, solo autenticación';

  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(JwtAuthGuard, PermissionGuard, ...additionalGuards),
    ApiBearerAuth(),
    ApiOperation({
      description,
    }),
  );
};
