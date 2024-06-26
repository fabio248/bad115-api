import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserLoginDto } from '../../users/dtos/response/user-login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserLoginDto> {
    const user = this.authService.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('exception.UNAUTHORIZED.INVALID_CREDENTIALS'),
      );
    }

    return user;
  }
}
