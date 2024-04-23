import { Exclude, Expose, Type } from 'class-transformer';
import { CountryDto } from './country.dto';
import { DepartmentDto } from './department.dto';
import { MunicipalityDto } from './municipality.dto';

@Exclude()
export class AddressDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly street: string;

  @Expose()
  readonly numberHouse: string;

  @Expose()
  @Type(() => CountryDto)
  readonly country: CountryDto;

  /**
   * Solamente se retorna cuando el país es El Salvador
   */
  @Expose()
  @Type(() => DepartmentDto)
  readonly department?: DepartmentDto;

  /**
   * Solamente se retorna cuando el país es El Salvador
   */
  @Expose()
  @Type(() => MunicipalityDto)
  readonly municipality?: MunicipalityDto;
}
