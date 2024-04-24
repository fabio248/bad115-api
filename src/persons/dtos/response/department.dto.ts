import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepartmentDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}
