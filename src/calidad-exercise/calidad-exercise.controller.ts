import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/services/auth.service';
import { CreateRegisterDto } from '../auth/dtos/request/create-register.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { Request as RequestType } from 'express';
import { CreateLoginDto } from '../auth/dtos/request/create-login.dto';
import { LoginDto } from '../auth/dtos/response/login.dto';
import { UserLoginDto } from '../users/dtos/response/user-login.dto';
import { RegisterDto } from '../auth/dtos/response/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CandidateFilterByRangeDateDto } from './dtos/request/candidate-filter-by-range-date.dto';
import { CalidadExerciseService } from './calidad-exercise.service';

@Controller('calidad')
export class CalidadExerciseController {
  constructor(
    private readonly authService: AuthService,
    private readonly calidadExerciseService: CalidadExerciseService,
  ) {}

  @Post('signup')
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
  ): Promise<RegisterDto> {
    return this.authService.register(createRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary:
      'Usar este endpoint para poder obtener el token necesarios para acceder al endpoint de filtrado',
  })
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Usar este endpoint para poder obtener el listado de candidatos filtrados por rango de fechas',
    description: `### Descripción de la ruta:
      * Endpoint: /calidad/filter-by-range-date
      * Método: POST
      * Autenticación: JWT
      * Permisos: Ninguno
    
    Descripción de los parametros del cuerpo de la petición: 
      * email: string (email del usuario) (requerido)
      * startDate: date (fecha de inicio) (opcional)
      * endDate: date (fecha de fin) (opcional)
      
      Ejemplo de uso:
      {
        "email": "test@test.com",
        "startDate": "2025-01-01",
        "endDate": "2025-01-01"
      }
    `,
  })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Candidato no encontrado',
      errorType: 'Not Found',
      path: 'calidad/filter-by-range-date',
    },
    {
      status: HttpStatus.BAD_REQUEST,
      message:
        'email must be an email; startDate must be a valid ISO 8601 date string; endDate must be a valid ISO 8601 date string',
      errorType: 'Bad Request',
      path: 'calidad/filter-by-range-date',
    },
    {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
      errorType: 'Unauthorized',
      path: 'calidad/filter-by-range-date',
    },
  ])
  @Post('filter-by-range-date')
  async filterByRangeDate(
    @Body() candidateFilterByRangeDateDto: CandidateFilterByRangeDateDto,
  ) {
    return this.calidadExerciseService.filterByRangeDate(
      candidateFilterByRangeDateDto,
    );
  }
}
