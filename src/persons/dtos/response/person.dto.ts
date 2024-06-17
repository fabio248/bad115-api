import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from '../../../users/dtos/response/user.dto';
import { AddressDto } from './address.dto';
import { GenderEnum } from '../../enums/gender.enum';
import { DocumentDto } from './document.dto';
import { SocialNetworkDto } from './social-network.dto';

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
  readonly gender: GenderEnum;

  @Expose()
  readonly candidateId: string;

  @Expose()
  readonly recruiterId: string;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly privacySettingsId: string;

  @Expose()
  readonly phone?: string;

  @Expose()
  @Type(() => UserDto)
  readonly user?: UserDto;

  @Expose()
  @Type(() => AddressDto)
  readonly address?: AddressDto;

  @Expose()
  @Type(() => DocumentDto)
  readonly documents?: DocumentDto[];

  @Expose()
  @Type(() => SocialNetworkDto)
  readonly socialNetwork?: SocialNetworkDto[];
}
