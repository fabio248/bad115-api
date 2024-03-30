import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegisterDto {
  @Expose()
  readonly userId: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly middleName?: string;

  @Expose()
  readonly secondLastName?: string;

  @Expose()
  readonly birthday: Date;
}
