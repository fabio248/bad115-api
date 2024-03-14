import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  accessToken: string;

  @Expose()
  roles: string[];

  @Expose()
  permissions: string[];
}
