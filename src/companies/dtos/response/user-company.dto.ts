import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserCompanyDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly avatar?: string;
}
