import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dtos/request/create-user.dto';
import { CreateLoginDto } from '../dtos/request/create-login.dto';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from '../interfaces';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dtos/response/login.dto';
import { UserLoginDto } from '../../users/dtos/response/user-login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersServices: UsersService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    this.logger.log('register');
    return this.usersServices.create(createUserDto);
  }

  async validateUser(createLoginDto: CreateLoginDto): Promise<UserLoginDto> {
    this.logger.log('validateUser');
    const { email, password: comingPassword } = createLoginDto;
    const user = await this.usersServices.findOneByEmail(email, {
      roles: true,
    });
    const [roles, permissions] = await Promise.all([
      this.usersServices.findRoles(user.id),
      this.usersServices.findPermissions(
        user.roles.map((userRole) => userRole.roleId),
      ),
    ]);

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
      await this.usersServices.update(user.id, {
        loginAttemps: user.loginAttemps + 1,
      });
      throw new UnauthorizedException(
        this.i18n.t('exception.UNAUTHORIZED.INVALID_CREDENTIALS'),
      );
    }

    if (isValidPassword) {
      await this.usersServices.update(user.id, {
        loginAttemps: 0,
      });

      return plainToInstance(UserLoginDto, {
        ...user,
        permissions: permissions.map((per) => per.codename),
        roles: roles.map((role) => role.name),
      });
    }

    return null;
  }

  async login(user: UserLoginDto): Promise<LoginDto> {
    this.logger.log('login');

    const payload: IPayload = {
      email: user.email,
      sub: user.id,
      permissions: user.permissions,
      roles: user.roles,
    };

    return plainToInstance(LoginDto, {
      accessToken: this.jwtService.sign(payload),
    });
  }
}
