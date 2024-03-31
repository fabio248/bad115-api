import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { UserIdDto } from '../dtos/request/user-id.dto';

@ApiTags('Users')
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
}
