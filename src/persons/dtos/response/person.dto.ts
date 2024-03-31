import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from '../../../users/dtos/response/user.dto';

@Exclude()
export class PersonDto {
  @Expose()
  readonly id: string;

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

  @Expose()
  readonly candidateId: string;

  @Expose()
  readonly recruiterId: string;

  @Expose()
  readonly userId: string;

  @Expose()
  @Type(() => UserDto)
  readonly user?: UserDto;
}
