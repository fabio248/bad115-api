import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = context.getArgs()[0].user.permissions;

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      return false;
    }

    return true;
  }
}
