import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateTypeTestDto } from '../request/create-type-test.dto';

@Exclude()
export class TestDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly result: boolean;

  @Expose()
  readonly urlDocs: string;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => CreateTypeTestDto)
  readonly test?: CreateTypeTestDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
