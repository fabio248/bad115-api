import { Controller } from '@nestjs/common';
import { Post, Param, Body, Get, Query, Put, Delete } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

//Dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { RecomendationService } from '../services/recomendation.service';
import { CreateRecomendationDto } from '../dto/request/create-recomendation.dto';
import { RecomendationDto } from '../dto/response/recomendation.dto';
import { RecomendationIdDto } from '../dto/request/recomendation-id.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserIdDto } from 'src/users/dtos/request/user-id.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateRecomendationDto } from '../dto/request/update-recomendation.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@Controller('candidates/:candidateId')
@ApiTags('Candidates Endpoints')
export class RecomendationController {
  constructor(private readonly recomendationService: RecomendationService) {}

  @Post('/recomendation/:userId')
  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { userId }: UserIdDto,
    @Body() createRecomendationDto: CreateRecomendationDto,
  ): Promise<RecomendationDto> {
    return this.recomendationService.create(
      candidateId,
      userId,
      createRecomendationDto,
    );
  }
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @Get('/:recomendationId')
  @ApiOperation({ summary: 'Get a recomendation by id' })
  findOne(
    @Param() { recomendationId }: RecomendationIdDto,
  ): Promise<RecomendationDto> {
    return this.recomendationService.findOne(recomendationId);
  }

  @Get('')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @ApiPaginatedResponse(RecomendationDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<RecomendationDto>> {
    return this.recomendationService.findAll(candidateId, pageDto);
  }

  @Put('/recomendation/:recomendationId')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  update(
    @Body() updateRecomendationDto: UpdateRecomendationDto,
    @Param() { candidateId }: CandidateIdDto,
    @Param() { recomendationId }: RecomendationIdDto,
  ): Promise<RecomendationDto> {
    return this.recomendationService.update(
      updateRecomendationDto,
      candidateId,
      recomendationId,
    );
  }
  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete('/recomendation/:recomendationId')
  remove(@Param() { recomendationId }: RecomendationIdDto) {
    return this.recomendationService.remove(recomendationId);
  }
}
