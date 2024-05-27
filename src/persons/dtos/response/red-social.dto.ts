import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { CreateTypeReSocialDto } from '../request/create-type-social-network.dto';

@Exclude()
export class RedSocialDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly nickname: string;

  @Expose()
  readonly url: string;

  @Expose()
  personId: string;

  @Expose()
  @Type(() => CreateTypeReSocialDto)
  readonly typeSocialNetwork?: CreateTypeReSocialDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
