import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from '../dtos/request/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return;
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }
}
