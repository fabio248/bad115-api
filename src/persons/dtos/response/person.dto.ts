import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PersonDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly middleName?: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly secondLastName?: string;

  @Expose()
  readonly birthday: Date;
}
