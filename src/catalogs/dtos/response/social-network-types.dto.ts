import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SocialNetworkTypesDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}
