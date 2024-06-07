import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JobAplicationService } from '../services/job-aplication.service';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CreateJobAplicationDto } from '../dto/request/create-job-aplication.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobAplicationDto } from '../dto/response/job-aplication.dto';
import { JobPositionId } from '../dto/request/create-job-position-id.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@Controller('candidates/:candidateId/job-aplication')
@ApiTags('Candidates Endpoints')
export class JobAplicationController {
  constructor(private readonly jobAplicationService: JobAplicationService) {}

  @ApiOperation({
    summary: 'Use this endpoint to create a new job application',
  })
  @Auth({ permissions: [permissions.CREATE_JOB.codename] })
  @Post('/job-position/:jobPositionId')
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { jobPositionId }: JobPositionId,
    @Body() createJobAplicationDto: CreateJobAplicationDto,
  ): Promise<JobAplicationDto> {
    return this.jobAplicationService.create(
      candidateId,
      jobPositionId,
      createJobAplicationDto,
    );
  }

  @ApiOperation({ summary: 'Use this endpoint to find a job application' })
  @Auth({ permissions: [permissions.READ_JOB.codename] })
  @Get('/job-position/:jobPositionId')
  @ApiOperation({ summary: 'Get a job Aplication by id' })
  findOne(
    @Param() { jobPositionId }: JobPositionId,
  ): Promise<JobAplicationDto> {
    return this.jobAplicationService.findOne(jobPositionId);
  }
}
