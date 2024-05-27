import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PermissionsService } from './services/permissions.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PermissionsService],
})
export class RolesModule {}
