import { Expose, Type } from 'class-transformer';
import { CountryDto } from './country.dto';

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
}
