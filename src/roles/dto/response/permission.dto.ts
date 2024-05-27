import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PermissionDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly codename: string;
}
