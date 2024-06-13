import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JobAplicationService } from 'src/job-aplication/services/job-aplication/job-aplication.service';
import { CandidateIdDto } from 'src/candidates/dto/request/candidate-id.dto';
import { CreateJobAplicationDto } from 'src/job-aplication/dto/request/create-job-aplication.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobAplicationDto } from 'src/job-aplication/dto/response/job-aplication.dto';
import { JobPositionId } from 'src/candidates/dto/request/create-job-position-id.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { JobAplicationIdDto } from 'src/job-aplication/dto/request/create-job-aplication-id.dto';
import { JobAplicationUpdateDto } from 'src/job-aplication/dto/request/job-apication-update.dto';

@Controller('job-aplication')
@ApiTags('Job Aplication Endpoints')
export class JobAplicationController {
  constructor(private readonly jobAplicationService: JobAplicationService) {}

  @ApiOperation({ summary: 'Use this endpoint to create a new job aplication' })
  @Auth({ permissions: [permissions.CREATE_JOB.codename] })
  @Post('/candidate/:candidateId/job-position/:jobPositionId')
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
  @ApiOperation({ summary: 'Use this endpoint to find a job aplication' })
  @Auth({ permissions: [permissions.READ_JOB.codename] })
  @Get('/:jobAplicationId')
  @ApiOperation({ summary: 'Get a job Aplication by id' })
  findOne(
    @Param() { jobAplicationId }: JobAplicationIdDto,
  ): Promise<JobAplicationDto> {
    return this.jobAplicationService.findOne(jobAplicationId);
  }

  @ApiOperation({ summary: 'Use this endpoint to update job aplications' })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put('/:jobAplicationId')
  update(
    @Param() { jobAplicationId }: JobAplicationIdDto,
    @Body() updateJobAplication: JobAplicationUpdateDto,
  ) {
    return this.jobAplicationService.update(
      jobAplicationId,
      updateJobAplication,
    );
  }

  @Delete('/:jobAplicationId')
  @Auth({ permissions: [permissions.DELETE_JOB.codename] })
  async remove(@Param() { jobAplicationId }: JobAplicationIdDto) {
    return this.jobAplicationService.remove(jobAplicationId);
  }
}
