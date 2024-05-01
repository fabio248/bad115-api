import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { UnlockAccountDto } from '../dtos/request/unlock-account.dto';

@ApiTags('Authentication Endpoints')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
  ): Promise<RegisterDto> {
    return this.authService.register(createRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Use this endpoint to authenticate user' })
  @ApiErrorResponse([
    {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Has excedido el número máximo de intentos de inicio de sesión.',
      errorType: 'Unprocessable Entity',
      path: 'auth/login',
    },
    {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Credenciales invalidas',
      errorType: 'Unauthorized',
      path: 'auth/login',
    },
  ])
  async login(
    @Request() req: RequestType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() createLoginDto: CreateLoginDto,
  ): Promise<LoginDto> {
    return this.authService.login(req.user as UserLoginDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Use this endpoint to refresh token' })
  @ApiErrorResponse([
    {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Token inválid o expirado.',
      errorType: 'Unauthorized',
      path: 'auth/refresh-token',
    },
  ])
  async refreshToken(
    @Body() refreshLoginDto: RefreshLoginDto,
  ): Promise<RefreshDto> {
    return this.authService.refreshToken(refreshLoginDto);
  }

  @Post('unlock-users')
  @ApiOperation({ summary: 'Use this endpoint to unblock user' })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Usuario no encontrado',
      errorType: 'Not Found',
      path: 'auth/unblock',
    },
    {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'La cuenta ya está activa.',
      errorType: 'Unprocessable Entity',
      path: 'auth/unblock',
    },
    {
      status: HttpStatus.CONFLICT,
      message: 'Debe haber al menos un administrador en el sistema.',
      errorType: 'Conflict',
      path: 'auth/unblock',
    },
  ])
  async unlockUser(@Body() { email }: UnlockAccountDto): Promise<void> {
    return this.authService.requestUnlockAccount(email);
  }
}
