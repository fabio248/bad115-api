import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { UserIdDto } from '../dtos/request/user-id.dto';
import { UserDto } from '../dtos/response/user.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';

@ApiTags('Users Endpoints')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth({
    permissions: [permissions.READ_USER.codename],
  })
  @Get('/:userId')
  async findOne(@Param() { userId }: UserIdDto) {
    return this.usersService.findOne(userId);
  }

  @Get('/:userId/all-user-conditioned')
  findAll(
    @Param() { userId }: UserIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<UserDto>> {
    return this.usersService.findAll(userId, pageDto);
  }
}
