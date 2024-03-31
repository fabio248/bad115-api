import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { PersonDto } from '../../../persons/dtos/response/person.dto';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => PersonDto)
  person?: PersonDto;

  @ApiHideProperty()
  password: string;

  @ApiHideProperty()
  createdAt: Date;

  @ApiHideProperty()
  updatedAt: Date;

  @ApiHideProperty()
  deletedAt: Date;
}
