import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { JobPositionService } from '../services/job-position.service';
import { CreateJobPositionDto } from '../dtos/request/create-job-position.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JobPositionDto } from '../dtos/response/job-position.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { IPayload } from '../../auth/interfaces';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';

@Controller('job-positions')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post('')
  @Auth()
  create(
    @CurrentUser() user: IPayload,
    @Body() createJobPositionDto: CreateJobPositionDto,
  ): Promise<JobPositionDto> {
    return this.jobPositionService.create(
      user.recruiterId,
      createJobPositionDto,
    );
  }

  @Get('')
  async findAll(
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<JobPositionDto>> {
    return this.jobPositionService.findAll(pageDto);
  }
}
