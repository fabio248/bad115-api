import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class MeetingDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly executionDate: Date;

  @Expose()
  readonly link: string;

  @Expose()
  readonly jobAplication: string;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
