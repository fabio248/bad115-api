import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { PersonDto } from '../../../persons/dtos/response/person.dto';

@Exclude()
export class UserDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly avatar?: string;

  @Expose()
  @Type(() => PersonDto)
  readonly person?: PersonDto;

  @ApiHideProperty()
  readonly password: string;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
