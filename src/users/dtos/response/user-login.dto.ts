import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class UserLoginDto extends UserDto {
  @Expose()
  roles: string[];

  @Expose()
  permissions: string[];
}
