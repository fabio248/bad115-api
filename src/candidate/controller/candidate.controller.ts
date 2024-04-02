import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { LaboralExperienceService } from '../services/laboral-experience.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';

//dto's
import { CreateLaboralExperienceDto } from '../dto/request/create-laboral-experience.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { LaboralExperienceDto } from '../dto/response/laboral-experience.dto';
import { LaboralExperienceIdDto } from '../dto/request/laboral-experience-id.dto';
import { UpdateLaboralExperienceDto } from '../dto/request/update-laboral-expirence.dto';

//pagination
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@Controller('candidates')
@Auth({ permissions: [permissions.MANAGE_USER.codename] })
@ApiTags('Candidates')
export class LaboralExperienceController {
  constructor(
    private readonly laboralExperienceService: LaboralExperienceService,
  ) {}

  @Post(':candidateId/laboral-experiences')
  @ApiErrorResponse([
    {
      status: 404,
      path: 'laboral-experience/{candidateId}',
      message: 'Candidato no encontrado.',
      errorType: 'Not Found',
    },
  ])
  create(
    @Body() createLaboralExperienceDto: CreateLaboralExperienceDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<LaboralExperienceDto> {
    return this.laboralExperienceService.create(
      createLaboralExperienceDto,
      candidateId,
    );
  }

  @Get('/candidateId/laboral-experiences/:laboralExpirenceId')
  @ApiErrorResponse([
    {
      status: 400,
      path: '/v1/candidates/candidateId/laboral-experiences/{laboralExperienceId}',
      message: 'laboralExpirenceId debe ser un uuid válido.',
      errorType: 'Id not valid',
    },
  ])
  @ApiOperation({
    summary: 'Use this endpoint to search a LaboralExperience',
  })
  findOne(
    @Param() { laboralExpirenceId }: LaboralExperienceIdDto,
  ): Promise<LaboralExperienceDto> {
    return this.laboralExperienceService.findOne(laboralExpirenceId);
  }

  @Get(':candidateId/laboral-experiences/laboralExpirenceId')
  @ApiErrorResponse([
    {
      status: 404,
      path: '/v1/candidates/{candidateId}/laboral-experiences/laboralExpirenceId?page=1&perPage=10',
      message: 'entities.LABORAL_EXPERIENCE no encontrado.',
      errorType: 'Not Found',
    },
  ])
  @ApiOperation({
    summary:
      'Use this endpoint to search all LaboralExperience asignered a one user',
  })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<LaboralExperienceDto>> {
    return this.laboralExperienceService.findAll(candidateId, pageDto);
  }

  @Put(':candidateId/laboral-experiences/:laboralExpirenceId')
  update(
    @Body() updateLaboralExperienceDto: UpdateLaboralExperienceDto,
    @Param() { laboralExpirenceId }: LaboralExperienceIdDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<LaboralExperienceDto> {
    return this.laboralExperienceService.update(
      updateLaboralExperienceDto,
      laboralExpirenceId,
      candidateId,
    );
  }

  @Delete('/candidateId/laboral-experiences/:laboralExpirenceId')
  remove(@Param() { laboralExpirenceId }: LaboralExperienceIdDto) {
    return this.laboralExperienceService.remove(laboralExpirenceId);
  }
}
