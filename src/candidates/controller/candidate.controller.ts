import { Controller, Get, Param, Query } from '@nestjs/common';
import { CandidateService } from '../services/candidate.service';
import { ApiTags } from '@nestjs/swagger';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CandidateDto } from '../dto/response/candidate.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { CandidateFilterDto } from '../dto/request/candidate-filter.dto';
import { JobApplicationService } from '../../job-application/services/job-aplication/job-application.service';
import { JobAplicationDto } from '../../job-application/dto/response/job-aplication.dto';

@Controller('candidates')
@ApiTags('Candidates Endpoints')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly jobApplicationService: JobApplicationService,
  ) {}

  @Get('/:candidateId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(@Param() { candidateId }: CandidateIdDto): Promise<CandidateDto> {
    return this.candidateService.findOne(candidateId);
  }

  @Get('')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @ApiPaginatedResponse(CandidateDto)
  findAll(
    @Query() pageDto: PageDto,
    @Query() candidateFilterDto: CandidateFilterDto,
  ): Promise<PaginatedDto<CandidateDto>> {
    return this.candidateService.findAll(pageDto, candidateFilterDto);
  }

  @ApiPaginatedResponse(JobAplicationDto)
  @Get('/:candidateId/job-applications')
  @Auth({ permissions: [permissions.READ_APPLICATION.codename] })
  async findJobApplications(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<JobAplicationDto>> {
    return this.jobApplicationService.findJobApplicationsByCandidate(
      candidateId,
      pageDto,
    );
  }
}
