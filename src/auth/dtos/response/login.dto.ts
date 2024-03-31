import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly refreshToken: string;
}
