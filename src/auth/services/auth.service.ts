import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateLoginDto } from '../dtos/request/create-login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from '../interfaces';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dtos/response/login.dto';
import { UserLoginDto } from '../../users/dtos/response/user-login.dto';
import { RefreshDto } from '../dtos/response/refresh.dto';
import { RefreshLoginDto } from '../dtos/request/refresh-token.dto';
import { CreateRegisterDto } from '../dtos/request/create-register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersServices: UsersService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateRegisterDto) {
    this.logger.log('register');
    return this.usersServices.create(createUserDto);
  }

  async validateUser(createLoginDto: CreateLoginDto): Promise<UserLoginDto> {
    this.logger.log('validateUser');
    const { email, password: comingPassword } = createLoginDto;
    const user = await this.usersServices.findOneByEmail(email, {
      roles: true,
      person: true,
    });

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('exception.UNAUTHORIZED.INVALID_CREDENTIALS'),
      );
    }

    if (user.loginAttemps >= 3) {
      throw new UnauthorizedException(
        this.i18n.t('exception.UNAUTHORIZED.MAX_LOGIN_ATTEMPTS'),
      );
    }

    const isValidPassword = await bcrypt.compare(comingPassword, user.password);

    if (!isValidPassword) {
      const loginAttemps = user.loginAttemps + 1;
      await this.usersServices.update(user.id, {
        loginAttemps,
        isActive: loginAttemps < 3,
      });

      throw new UnauthorizedException(
        this.i18n.t('exception.UNAUTHORIZED.INVALID_CREDENTIALS'),
      );
    }

    const [roles, permissions] = await Promise.all([
      this.usersServices.findRoles(user.id),
      this.usersServices.findPermissions(
        user.roles.map((userRole) => userRole.roleId),
      ),
      this.usersServices.update(user.id, {
        loginAttemps: 0,
      }),
    ]);

    return plainToInstance(UserLoginDto, {
      ...user,
      permissions: permissions.map((permission) => permission.codename),
      roles: roles.map((role) => role.name),
    });
  }

  async login(user: UserLoginDto): Promise<LoginDto> {
    this.logger.log('login');

    const payload: IPayload = {
      email: user.email,
      userId: user.id,
      candidateId: user.person?.candidateId,
      recruiterId: user.person?.recruiterId,
      personId: user.person.id,
      permissions: user.permissions,
      roles: user.roles,
    };

    return plainToInstance(LoginDto, {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('app.jwt.expiresInRefresh'),
      }),
    });
  }

  async refreshToken(refreshLoginDto: RefreshLoginDto): Promise<RefreshDto> {
    const user = this.jwtService.verify(refreshLoginDto.refreshToken);
    const payload: IPayload = {
      email: user.email,
      userId: user.id,
      candidateId: user.person.candidateId,
      recruiterId: user.person.recruiterId,
      personId: user.person.id,
      permissions: user.permissions,
      roles: user.roles,
    };
    return plainToInstance(RefreshDto, {
      accessToken: this.jwtService.sign(payload),
    });
  }
}
