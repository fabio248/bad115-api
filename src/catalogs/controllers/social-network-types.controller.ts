import { Controller, Get } from '@nestjs/common';
import { SocialNetworkTypesService } from '../services/social-network-types.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Social Network Types Endpoints')
@Controller('catalogs/social-network-types')
export class SocialNetworkTypesController {
  constructor(private readonly socialNetworkTypes: SocialNetworkTypesService) {}

  @Get('')
  findAll() {
    return this.socialNetworkTypes.findAll();
  }
}
