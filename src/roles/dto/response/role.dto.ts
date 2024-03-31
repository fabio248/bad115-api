import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RoleDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}
