import { Controller, Get, Query } from '@nestjs/common';
import { AdminsService } from '../services/admins.service';
import { PageDto } from '../../common/dtos/request/page.dto';
import { UnlockRequestFilterDto } from '../dtos/request/unlock-request-filter.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Endpoints')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('unlock-requests')
  async getUnlockRequests(
    @Query() pageDto: PageDto,
    @Query() unlockRequestFilterDto: UnlockRequestFilterDto,
  ) {
    return this.adminsService.getUnlockRequests(
      pageDto,
      unlockRequestFilterDto,
    );
  }
}
