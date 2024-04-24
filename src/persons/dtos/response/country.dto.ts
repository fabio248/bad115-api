import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CountryDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly areaCode: string;
}
