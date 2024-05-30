import { Exclude, Expose } from 'class-transformer';
import { CountryDto } from '../../../persons/dtos/response/country.dto';
import { UserDto } from '../../../users/dtos/response/user.dto';
import { CompanySizeEnum } from '../../enums/company-size.enum';

@Exclude()
export class CompanyDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly size: CompanySizeEnum;

  @Expose()
  readonly description?: string;

  @Expose()
  readonly website?: string;

  @Expose()
  readonly phone?: string;

  @Expose()
  readonly logo?: string;

  @Expose()
  readonly type?: string;

  @Expose()
  readonly assignedRecruiter: number;

  @Expose()
  readonly user: UserDto;

  @Expose()
  readonly country?: CountryDto;
}
