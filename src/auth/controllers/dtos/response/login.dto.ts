import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  accessToken: string;
}
