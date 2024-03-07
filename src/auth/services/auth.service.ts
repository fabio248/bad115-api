import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dtos/request/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersServices: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    return this.usersServices.create(createUserDto);
  }
}
