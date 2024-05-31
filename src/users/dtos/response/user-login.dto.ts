import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';
import { CompanyDto } from '../../../companies/dtos/response/company.dto';
import { OmitType } from '@nestjs/swagger';

export class UserLoginDto extends OmitType(UserDto, ['roles']) {
  @Expose()
  roles: string[];

  @Expose()
  permissions: string[];

  @Expose()
  company: CompanyDto;
}
