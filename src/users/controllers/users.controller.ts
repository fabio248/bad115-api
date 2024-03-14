import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { IdDto } from '../../common/dtos/id.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth({
    permissions: [permissions.READ_USER.codename],
  })
  @Get('/:id')
  async findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }
}
