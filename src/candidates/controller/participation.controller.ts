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

@Controller('candidates/:candidateId/participation')
@ApiTags('Candidates Endpoints')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

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
  findOne(
    @Param() { participationId }: ParticipationIdDto,
  ): Promise<ParticipationDto> {
    return this.participationService.findOne(participationId);
  }

  @Get('')
  @ApiPaginatedResponse(ParticipationDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<ParticipationDto>> {
    return this.participationService.findAll(candidateId, pageDto);
  }

  @Put('/:participationId')
  update(
    @Param() { participationId }: ParticipationIdDto,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ): Promise<ParticipationDto> {
    return this.participationService.update(
      updateParticipationDto,
      participationId,
    );
  }

  @Delete('/:participationId')
  remove(@Param() { participationId }: ParticipationIdDto) {
    return this.participationService.remove(participationId);
  }
}
