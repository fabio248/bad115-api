import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SocialNetworkTypesService } from '../services/social-network-types.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { SocialNetworkTypesDto } from '../dtos/response/social-network-types.dto';
import { CreateSocialNetworkTypesDto } from '../dtos/request/create-social-network-type.dto';
import { SocialNetworkTypeIdDto } from '../dtos/request/create-social-network-types-id.dto';
import { permissions } from 'prisma/seeds/permissions.seed';
import { UpdateSocialNetworkTypesDto } from '../dtos/request/update-social-network-type.dto';

@ApiTags('Social Network Types Endpoints')
@Controller('catalogs/social-network-types')
export class SocialNetworkTypesController {
  constructor(private readonly socialNetworkTypes: SocialNetworkTypesService) {}

  @Post('')
  @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  create(
    @Body() createSocialNetworkTypesDto: CreateSocialNetworkTypesDto,
  ): Promise<SocialNetworkTypesDto> {
    return this.socialNetworkTypes.create(createSocialNetworkTypesDto);
  }

  @Get('/:socialNetworkTypesId')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findOne(
    @Param() { socialNetworkTypesId }: SocialNetworkTypeIdDto,
  ): Promise<SocialNetworkTypesDto> {
    return this.socialNetworkTypes.findOne(socialNetworkTypesId);
  }

  @Get('')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAll() {
    return this.socialNetworkTypes.findAll();
  }
  @Put('/:socialNetworkTypesId')
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  async update(
    @Param() { socialNetworkTypesId }: SocialNetworkTypeIdDto,
    @Body() updateSocialNetworkTypesDto: UpdateSocialNetworkTypesDto,
  ): Promise<SocialNetworkTypesDto> {
    return this.socialNetworkTypes.update(
      socialNetworkTypesId,
      updateSocialNetworkTypesDto,
    );
  }

  @Delete('/:socialNetworkTypesId')
  @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  async remove(@Param() { socialNetworkTypesId }: SocialNetworkTypeIdDto) {
    return this.socialNetworkTypes.remove(socialNetworkTypesId);
  }
}
