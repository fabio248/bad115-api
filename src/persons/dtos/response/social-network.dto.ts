import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { SocialNetworkTypesDto } from '../../../catalogs/dtos/response/social-network-types.dto';

@Exclude()
export class SocialNetworkDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly nickname: string;

  @Expose()
  readonly url: string;

  @Expose()
  personId: string;

  @Expose()
  @Type(() => SocialNetworkTypesDto)
  readonly typeSocialNetwork?: SocialNetworkTypesDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
