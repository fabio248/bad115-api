import { Controller, Get, Query } from '@nestjs/common';
import { Put, Post, Delete, Param, Body } from '@nestjs/common';

import { ParticipationService } from '../services/participation.service';
//Dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CreateParticipationDto } from '../dto/request/create-participation.dto';
import { ParticipationIdDto } from '../dto/request/participation-id.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';

import { ApiTags } from '@nestjs/swagger';
import { UpdateParticipationDto } from '../dto/request/update-participation.dto';
import { ParticipationDto } from '../dto/response/participation.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@Controller('candidates/:candidateId/participation')
@ApiTags('Candidates Endpoints')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  @Post('')
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createParticipationDto: CreateParticipationDto,
  ): Promise<ParticipationDto> {
    return this.participationService.create(
      candidateId,
      createParticipationDto,
    );
  }

  @Get('/:participationId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(
    @Param() { participationId }: ParticipationIdDto,
  ): Promise<ParticipationDto> {
    return this.participationService.findOne(participationId);
  }

  @Get('')
  @ApiPaginatedResponse(ParticipationDto)
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<ParticipationDto>> {
    return this.participationService.findAll(candidateId, pageDto);
  }

  @Put('/:participationId')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  update(
    @Param() { participationId }: ParticipationIdDto,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ): Promise<ParticipationDto> {
    return this.participationService.update(
      updateParticipationDto,
      participationId,
    );
  }

  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete('/:participationId')
  remove(@Param() { participationId }: ParticipationIdDto) {
    return this.participationService.remove(participationId);
  }
}
