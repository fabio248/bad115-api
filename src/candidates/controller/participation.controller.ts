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
  ): Promise<CreateParticipationDto> {
    return this.participationService.create(
      candidateId,
      createParticipationDto,
    );
  }

  @Get('/:participationId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(
    @Param() { participationId }: ParticipationIdDto,
  ): Promise<CreateParticipationDto> {
    return this.participationService.findOne(participationId);
  }

  @Get('')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<CreateParticipationDto>> {
    return this.participationService.findAll(candidateId, pageDto);
  }

  @Put('/:participationId')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  update(
    @Param() { participationId }: ParticipationIdDto,
    @Param() { candidateId }: CandidateIdDto,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ): Promise<CreateParticipationDto> {
    return this.participationService.update(
      updateParticipationDto,
      participationId,
      candidateId,
    );
  }

  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete('/:participationId')
  remove(@Param() { participationId }: ParticipationIdDto) {
    return this.participationService.remove(participationId);
  }
}
