import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dtos/request/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { Request as RequestType } from 'express';
import { User } from '@prisma/client';
import { LoginDto } from '../dtos/response/login.dto';
import { UserDto } from '../../users/dtos/response/user.dto';
import { CreateLoginDto } from '../dtos/request/create-login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Use this endpoint to authenticate user' })
  async login(
    @Request() req: RequestType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() createLoginDto: CreateLoginDto,
  ): Promise<LoginDto> {
    return this.authService.login(req.user as User);
  }
}
