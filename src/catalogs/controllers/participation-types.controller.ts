import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParticipationTypesService } from '../services/participation-types.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';

@ApiTags('Participation Types Endpoints')
@Controller('catalogs/participation-types')
export class ParticipationTypesController {
  constructor(
    private readonly participationTypesService: ParticipationTypesService,
  ) {}

  @Get('')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findAll() {
    return this.participationTypesService.findAll();
  }
}
