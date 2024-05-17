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
import { LaboralExperiencesService } from '../services/laboral-experiences.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';

//dto's
// Laboral Experience
import { CreateLaboralExperienceDto } from '../dto/request/create-laboral-experience.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { LaboralExperienceDto } from '../dto/response/laboral-experience.dto';
import { LaboralExperienceIdDto } from '../dto/request/laboral-experience-id.dto';
import { UpdateLaboralExperienceDto } from '../dto/request/update-laboral-expirence.dto';
//pagination
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@Controller('candidates/:candidateId/laboral-experiences')
@ApiTags('Candidates Endpoints')
export class LaboralExperiencesController {
  constructor(
    private readonly laboralExperiencesService: LaboralExperiencesService,
  ) {}

  //LABORAL EXPERIENCE CRUD
  @Post('')
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
    return this.laboralExperiencesService.create(
      createLaboralExperienceDto,
      candidateId,
    );
  }

  @Get('/:laboralExperienceId')
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
    @Param() { laboralExperienceId }: LaboralExperienceIdDto,
  ): Promise<LaboralExperienceDto> {
    return this.laboralExperiencesService.findOne(laboralExperienceId);
  }

  @Get('')
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
      'Use this endpoint to search all labor experience assigned to a candidate.',
  })
  @ApiPaginatedResponse(LaboralExperienceDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<LaboralExperienceDto>> {
    return this.laboralExperiencesService.findAll(candidateId, pageDto);
  }

  @Put('/:laboralExperienceId')
  update(
    @Body() updateLaboralExperienceDto: UpdateLaboralExperienceDto,
    @Param() { laboralExperienceId }: LaboralExperienceIdDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<LaboralExperienceDto> {
    return this.laboralExperiencesService.update(
      updateLaboralExperienceDto,
      laboralExperienceId,
      candidateId,
    );
  }

  @Delete('/:laboralExperienceId')
  remove(@Param() { laboralExperienceId }: LaboralExperienceIdDto) {
    return this.laboralExperiencesService.remove(laboralExperienceId);
  }
}
