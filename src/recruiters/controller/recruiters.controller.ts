import { Controller, Get, Param } from '@nestjs/common';
import { RecruitersService } from '../services/recruiters.service';
import { ApiTags } from '@nestjs/swagger';
import { RecruiterIdDto } from '../dtos/request/recruiter-id.dto';

@ApiTags('Recruiters Endpoints')
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersServices: RecruitersService) {}

  @Get('/:recruiterId/companies')
  async getRecruitersCompany(@Param() { recruiterId }: RecruiterIdDto) {
    return this.recruitersServices.getRecruitersCompany(recruiterId);
  }
}
