import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentDto } from './department.dto';

@Exclude()
export class MunicipalityDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly departmentId: string;

  @Expose()
  @Type(() => DepartmentDto)
  readonly department?: DepartmentDto;
}
