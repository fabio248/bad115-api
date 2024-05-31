import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { AdminsService } from '../services/admins.service';
import { PageDto } from '../../common/dtos/request/page.dto';
import { UnlockRequestFilterDto } from '../dtos/request/unlock-request-filter.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUnlockRequestDto } from '../dtos/request/update-unlock-request.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { UnlockRequestIdDto } from '../dtos/request/unlock-request-id.dto';

@ApiTags('Admin Endpoints')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Auth({ permissions: [permissions.READ_UNLOCK_REQUEST.codename] })
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

  @Auth({ permissions: [permissions.UNLOCK_USER.codename] })
  @Put('unlock-requests/:unlockRequestId')
  async updateUnlockRequest(
    @Param() { unlockRequestId }: UnlockRequestIdDto,
    @Body() updateUnlockRequestDto: UpdateUnlockRequestDto,
  ) {
    return this.adminsService.updateUnlockRequest(
      unlockRequestId,
      updateUnlockRequestDto,
    );
  }
}
