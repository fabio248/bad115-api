import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dtos/request/create-user.dto';
import { CreateLoginDto } from '../controllers/dtos/request/create-login.dto';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from '../interfaces';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../controllers/dtos/response/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UsersService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.usersServices.create(createUserDto);
  }

  async validateUser(loginDto: CreateLoginDto): Promise<User> {
    const { email, password: comingPassword } = loginDto;
    const user = await this.usersServices.findOneByEmail(email);

    if (!user) {
      await this.usersServices.update(user.id, {
        loginAttemps: user.loginAttemps + 1,
      });
      throw new UnprocessableEntityException(
        this.i18n.t('exception.UNAUTHORIZED.INVALID_CREDENTIALS'),
      );
    }

    if (user.loginAttemps >= 3) {
      throw new UnprocessableEntityException(
        this.i18n.t('exception.UNAUTHORIZED.MAX_LOGIN_ATTEMPTS'),
      );
    }
    const isValidPassword = await bcrypt.compare(comingPassword, user.password);

    if (!isValidPassword) {
      await this.usersServices.update(user.id, {
        loginAttemps: user.loginAttemps + 1,
      });
      return null;
    }

    if (isValidPassword) {
      await this.usersServices.update(user.id, {
        loginAttemps: 0,
      });
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload: IPayload = { email: user.email, sub: user.id };

    return plainToInstance(LoginDto, {
      access_token: this.jwtService.sign(payload),
    });
  }
}
