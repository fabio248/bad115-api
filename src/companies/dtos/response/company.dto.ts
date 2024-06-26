import { Exclude, Expose, Type } from 'class-transformer';
import { CountryDto } from '../../../persons/dtos/response/country.dto';
import { CompanySizeEnum } from '../../enums/company-size.enum';
import { UserCompanyDto } from './user-company.dto';

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
  @Type(() => UserCompanyDto)
  readonly user: UserCompanyDto;

  @Expose()
  @Type(() => CountryDto)
  readonly country?: CountryDto;
}
