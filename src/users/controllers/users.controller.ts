import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { UserIdDto } from '../dtos/request/user-id.dto';
import { UserDto } from '../dtos/response/user.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { UserFilterDto } from '../dtos/request/user-filter.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';

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

  @Auth({
    permissions: [permissions.MANAGE_USER.codename],
  })
  @Get('')
  findAll(
    @Query() pageDto: PageDto,
    @Query() userFilterDto: UserFilterDto,
  ): Promise<PaginatedDto<UserDto>> {
    return this.usersService.findAll(pageDto, userFilterDto);
  }

  @Auth({
    permissions: [permissions.MANAGE_USER.codename],
  })
  @Put('/:userId')
  async update(
    @Param() { userId }: UserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
