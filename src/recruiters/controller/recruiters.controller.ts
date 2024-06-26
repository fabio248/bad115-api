import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecruitersService } from '../services/recruiters.service';
import { ApiTags } from '@nestjs/swagger';
import { RecruiterIdDto } from '../dtos/request/recruiter-id.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { JobPositionDto } from '../../job-position/dtos/response/job-position.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Recruiters Endpoints')
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersServices: RecruitersService) {}

  @Get('/:recruiterId/companies')
  async getRecruitersCompany(@Param() { recruiterId }: RecruiterIdDto) {
    return this.recruitersServices.getRecruitersCompany(recruiterId);
  }

  @ApiPaginatedResponse(JobPositionDto)
  @Get('/:recruiterId/job-positions')
  async findAllJobPositions(
    @Param() { recruiterId }: RecruiterIdDto,
    @Query() pageDto: PageDto,
  ) {
    return this.recruitersServices.findAllJobPositions(recruiterId, pageDto);
  }
}
