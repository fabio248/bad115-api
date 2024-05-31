import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParticipationTypesService } from '../services/participation-types.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { ParticipationTypesDto } from '../dtos/response/participation-types.dto';
import { CreateParticipationTypesDto } from '../dtos/request/create-participation-types.dto';
import { ParticipationTypeIdDto } from '../dtos/request/create-participation-types-id.dto';
import { UpdateParticipationTypeDto } from '../dtos/request/update-participation-type.dto';

@ApiTags('Participation Types Endpoints')
@Controller('catalogs/participation-types')
export class ParticipationTypesController {
  constructor(
    private readonly participationTypesService: ParticipationTypesService,
  ) {}
  @Post('')
  @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  create(
    @Body() createParticipationTypesDto: CreateParticipationTypesDto,
  ): Promise<ParticipationTypesDto> {
    return this.participationTypesService.create(createParticipationTypesDto);
  }

  @Get('/:participationTypeId')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findOne(
    @Param() { participationTypeId }: ParticipationTypeIdDto,
  ): Promise<ParticipationTypesDto> {
    return this.participationTypesService.findOne(participationTypeId);
  }

  @Get('')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findAll(): Promise<ParticipationTypesDto[]> {
    return this.participationTypesService.findAll();
  }
  @Put('/:participationTypeId')
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  async update(
    @Param() { participationTypeId }: ParticipationTypeIdDto,
    @Body() updateParticipationTypeDto: UpdateParticipationTypeDto,
  ): Promise<ParticipationTypesDto> {
    return this.participationTypesService.update(
      participationTypeId,
      updateParticipationTypeDto,
    );
  }

  @Delete('/:participationTypeId')
  @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  async remove(@Param() { participationTypeId }: ParticipationTypeIdDto) {
    return this.participationTypesService.remove(participationTypeId);
  }
}
