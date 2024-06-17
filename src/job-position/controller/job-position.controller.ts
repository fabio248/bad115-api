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
import { JobPositionService } from '../services/job-position.service';
import { CreateJobPositionDto } from '../dtos/request/create-job-position.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JobPositionDto } from '../dtos/response/job-position.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { IPayload } from '../../auth/interfaces';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IdDto } from '../../common/dtos/request/id.dto';
import { UpdateJobPositionDto } from '../dtos/request/update-job-position.dto';
import { UpdateRequirementDto } from '../dtos/request/update-requeriments.dto';
import { UpdateTechnicalSkillsDto } from '../dtos/request/update-technical-skills.dto';
import { UpdateLanguageSkillsDto } from '../dtos/request/update-language-skills.dto';
import { UpdateAddressDto } from '../dtos/request/update-address.dto';
import { AddressIdDto } from '../../common/dtos/request/address-id.dto';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { JobPositionFilterDto } from '../dtos/request/job-position-filter.dto';
import { JobPositionCountDto } from '../dtos/response/job-position-count.dto';
import { JobApplicationService } from '../../job-application/services/job-aplication/job-application.service';
import { JobPositionId } from '../../candidates/dto/request/create-job-position-id.dto';
import { JobAplicationDto } from '../../job-application/dto/response/job-aplication.dto';
import { JobApplicationFilterDto } from '../../job-application/dto/request/job-application-filter.dto';

@ApiTags('Job Positions Endpoints')
@Controller('job-positions')
export class JobPositionController {
  constructor(
    private readonly jobPositionService: JobPositionService,
    private readonly jobApplicationService: JobApplicationService,
  ) {}

  @Post('')
  @Auth({ permissions: [permissions.CREATE_JOB.codename] })
  create(
    @CurrentUser() user: IPayload,
    @Body() createJobPositionDto: CreateJobPositionDto,
  ): Promise<JobPositionDto> {
    return this.jobPositionService.create(
      user.recruiterId,
      createJobPositionDto,
    );
  }

  @ApiPaginatedResponse(JobPositionDto)
  @Auth({ permissions: [permissions.READ_JOB.codename] })
  @Get('')
  async findAll(
    @Query() pageDto: PageDto,
    @Query() jobPositionFilterDto: JobPositionFilterDto,
  ): Promise<PaginatedDto<JobPositionDto>> {
    return this.jobPositionService.findAll(pageDto, jobPositionFilterDto);
  }

  @Auth({ permissions: [permissions.READ_JOB.codename] })
  @Get('/count')
  async findAllJob(): Promise<JobPositionCountDto> {
    return this.jobPositionService.findAllJob();
  }

  @Auth({ permissions: [permissions.READ_JOB.codename] })
  @Get(':id')
  async findOne(@Param() { id }: IdDto): Promise<JobPositionDto> {
    return this.jobPositionService.findOne(id);
  }

  @ApiOperation({ summary: 'Use this endpoint to update job position' })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateJobPositionDto: UpdateJobPositionDto,
  ): Promise<JobPositionDto> {
    return this.jobPositionService.update(id, updateJobPositionDto);
  }

  @ApiOperation({
    summary: 'Use this endpoint to update requirements of job position',
  })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put(':id/requirements')
  async updateRequirements(
    @Param() { id }: IdDto,
    @Body() updateRequirementDto: UpdateRequirementDto,
  ): Promise<void> {
    return this.jobPositionService.updateRequirements(id, updateRequirementDto);
  }

  @ApiOperation({
    summary: 'Use this endpoint to update technical skills of job position',
  })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put(':id/technical-skills')
  async updateTechnicalSkills(
    @Param() { id }: IdDto,
    @Body() updateTechnicalSkillsDto: UpdateTechnicalSkillsDto,
  ): Promise<void> {
    return this.jobPositionService.updateTechnicalSkills(
      id,
      updateTechnicalSkillsDto,
    );
  }

  @ApiOperation({
    summary: 'Use this endpoint to update language skills of job position',
  })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put(':id/language-skills')
  async updateLanguageSkills(
    @Param() { id }: IdDto,
    @Body() updateLanguageSkillsDto: UpdateLanguageSkillsDto,
  ): Promise<void> {
    return this.jobPositionService.updateLanguageSkills(
      id,
      updateLanguageSkillsDto,
    );
  }

  @ApiOperation({
    summary: 'Use this endpoint to update address of job position',
    description:
      'Este endpoint actulizará la dirección asociada a una posición de trabajo específica.' +
      ' Cuando se llama a esta función, se pasan tres argumentos: el ID de la posición de trabajo, el ID de la dirección que se va a actualizar y un objeto con los nuevos datos de la dirección.' +
      'Primero, la función verifica que la posición de trabajo exista en la base de datos. Si no se encuentra, se lanza una excepción y se detiene la ejecución.Luego, se llama al servicio addressesService.update, ' +
      'que se encarga de actualizar la dirección en la base de datos. Este servicio recibe el ID de la dirección y el objeto con los nuevos datos. ' +
      'Realiza varias validaciones, como verificar que el país, el departamento y el municipio existan en la base de datos. ' +
      'Si el país es "El Salvador", se actualizan los datos del país, departamento y municipio.Si el país no es "El Salvador", solo se actualiza el dato del país y se eliminan los datos del departamento y municipio. ' +
      'Si todas las validaciones son exitosas, se actualiza la dirección en la base de datos y se termina la ejecución de la función. ' +
      'Si ocurre algún error durante las validaciones o la actualización, se lanza una excepción y se detiene la ejecución.',
  })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put(':id/address/:addressId')
  async updateAddress(
    @Param() { id }: IdDto,
    @Param() { addressId }: AddressIdDto,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<void> {
    return this.jobPositionService.updateAddress(
      id,
      addressId,
      updateAddressDto,
    );
  }

  @Auth({ permissions: [permissions.DELETE_JOB.codename] })
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.jobPositionService.remove(id);
  }

  @ApiOperation({
    summary: 'Use this endpoint to get candidates matched with job position',
  })
  @Auth({ permissions: [permissions.READ_JOB.codename] })
  @Get(':id/candidates')
  async matchedCandidates(@Param() { id }: IdDto) {
    return this.jobPositionService.calculatePercentageMatchCandidateJobPosition(
      id,
    );
  }

  @ApiOperation({
    summary:
      'Use this endpoint to find all job applications by job position id',
  })
  @ApiPaginatedResponse(JobAplicationDto)
  // @Auth({ permissions: [permissions.READ_APPLICATION.codename] })
  @Get('/:jobPositionId/job-applications')
  findAllByJobPosition(
    @Param() { jobPositionId }: JobPositionId,
    @Query() pageDto: PageDto,
    @Query() jobApplicationFilterDto: JobApplicationFilterDto,
  ): Promise<PaginatedDto<JobAplicationDto>> {
    return this.jobApplicationService.findAllByJobPosition(
      jobPositionId,
      pageDto,
      jobApplicationFilterDto,
    );
  }
}
