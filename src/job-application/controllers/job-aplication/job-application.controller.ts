import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JobApplicationService } from 'src/job-application/services/job-aplication/job-application.service';
import { CandidateIdDto } from 'src/candidates/dto/request/candidate-id.dto';
import { CreateJobAplicationDto } from 'src/job-application/dto/request/create-job-aplication.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobAplicationDto } from 'src/job-application/dto/response/job-aplication.dto';
import { JobPositionId } from 'src/candidates/dto/request/create-job-position-id.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { JobAplicationIdDto } from 'src/job-application/dto/request/create-job-aplication-id.dto';
import { UpdateJobApplicationDto } from 'src/job-application/dto/request/update-job-application.dto';

@Controller('job-applications')
@ApiTags('Job Application Endpoints')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @ApiOperation({
    summary: 'Use this endpoint to create a new job application',
  })
  @Auth({ permissions: [permissions.CREATE_APPLICATION.codename] })
  @Post('/candidate/:candidateId/job-position/:jobPositionId')
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { jobPositionId }: JobPositionId,
    @Body() createJobApplicationDto: CreateJobAplicationDto,
  ): Promise<JobAplicationDto> {
    return this.jobApplicationService.create(
      candidateId,
      jobPositionId,
      createJobApplicationDto,
    );
  }

  @ApiOperation({ summary: 'Use this endpoint to find a job aplication' })
  @Auth({ permissions: [permissions.READ_APPLICATION.codename] })
  @Get('/:jobApplicationId')
  @ApiOperation({ summary: 'Get a job Aplication by id' })
  findOne(
    @Param() { jobApplicationId }: JobAplicationIdDto,
  ): Promise<JobAplicationDto> {
    return this.jobApplicationService.findOne(jobApplicationId);
  }

  @ApiOperation({ summary: 'Use this endpoint to update job applications' })
  @Auth({ permissions: [permissions.UPDATE_JOB.codename] })
  @Put('/:jobApplicationId')
  update(
    @Param() { jobApplicationId }: JobAplicationIdDto,
    @Body() updateJobApplication: UpdateJobApplicationDto,
  ) {
    return this.jobApplicationService.update(
      jobApplicationId,
      updateJobApplication,
    );
  }

  @Delete('/:jobApplicationId')
  @Auth({ permissions: [permissions.DELETE_JOB.codename] })
  async remove(@Param() { jobApplicationId }: JobAplicationIdDto) {
    return this.jobApplicationService.remove(jobApplicationId);
  }
}
