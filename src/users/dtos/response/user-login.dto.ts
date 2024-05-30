import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';
import { CompanyDto } from '../../../companies/dtos/response/company.dto';

export class UserLoginDto extends UserDto {
  @Expose()
  roles: string[];

  @Expose()
  permissions: string[];

  @Expose()
  company: CompanyDto;
}
