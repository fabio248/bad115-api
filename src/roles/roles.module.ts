import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';

@Module({
  controllers: [RolesController, PermissionsController],
  providers: [RolesService, PermissionsService],
})
export class RolesModule {}
