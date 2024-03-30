import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { Request as RequestType } from 'express';
import { LoginDto } from '../dtos/response/login.dto';
import { CreateLoginDto } from '../dtos/request/create-login.dto';
import { UserLoginDto } from '../../users/dtos/response/user-login.dto';
import { RefreshDto } from '../dtos/response/refresh.dto';
import { RefreshLoginDto } from '../dtos/request/refresh-token.dto';
import { CreateRegisterDto } from '../dtos/request/create-register.dto';
import { RegisterDto } from '../dtos/response/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
  ): Promise<RegisterDto> {
    return this.authService.register(createRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Use this endpoint to authenticate user' })
  async login(
    @Request() req: RequestType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() createLoginDto: CreateLoginDto,
  ): Promise<LoginDto> {
    return this.authService.login(req.user as UserLoginDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Use this endpoint to refresh token' })
  async refreshToken(
    @Body() refreshLoginDto: RefreshLoginDto,
  ): Promise<RefreshDto> {
    return this.authService.refreshToken(refreshLoginDto);
  }
}
