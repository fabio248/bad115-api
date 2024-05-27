import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialNetworkService } from '../services/socialnetwork.service';

//Dto's
import { CreateSocialNetworkDto } from '../dtos/request/create-social-network.dto';
import { PersonIdDto } from '../dtos/request/person-id.dto';
import { SocialNetworkDto } from '../dtos/response/social-network.dto';
import { SocialNetworkIdDto } from '../dtos/request/social-network-id.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateSocialNetworkDto } from '../dtos/request/update-red-social.dto';

@Controller('person/:personId/social-network')
@ApiTags('Persons Endpoints')
export class SocialNetworkController {
  constructor(private readonly socialNetworkService: SocialNetworkService) {}

  @ApiOperation({
    summary: 'Use this endpoint to create an red social for a person by',
  })
  @Post('')
  // @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  create(
    @Body() createRedSocialDto: CreateSocialNetworkDto,
    @Param() { personId }: PersonIdDto,
  ): Promise<SocialNetworkDto> {
    return this.socialNetworkService.create(createRedSocialDto, personId);
  }

  @ApiOperation({
    summary: 'Use this endpoint to search an social network by id',
  })
  @Get('/:socialNetworkId')
  findOne(
    @Param() { socialNetworkId }: SocialNetworkIdDto,
  ): Promise<SocialNetworkDto> {
    return this.socialNetworkService.findOne(socialNetworkId);
  }

  @Get('')
  @ApiOperation({
    summary:
      'Use this endpoint to search all social networks asignered a one person',
  })
  @ApiPaginatedResponse(SocialNetworkDto)
  findAll(
    @Param() { personId }: PersonIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<SocialNetworkDto>> {
    return this.socialNetworkService.findAll(personId, pageDto);
  }

  @Put('/:socialNetworkId')
  @ApiOperation({
    summary: 'Use this endpoint to update social network ',
  })
  update(
    @Body() updateRedSocialDto: UpdateSocialNetworkDto,
    @Param() { socialNetworkId }: SocialNetworkIdDto,
  ): Promise<SocialNetworkDto> {
    return this.socialNetworkService.update(
      updateRedSocialDto,
      socialNetworkId,
    );
  }

  @Delete('/:socialNetworkId')
  remove(@Param() { socialNetworkId }: SocialNetworkIdDto) {
    return this.socialNetworkService.remove(socialNetworkId);
  }
}
