import { Exclude, Expose, Type } from 'class-transformer';
import { PermissionDto } from './permission.dto';

@Exclude()
export class RoleDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => PermissionDto)
  readonly permissions: PermissionDto[];
}
