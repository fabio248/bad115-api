import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { OrganizationContactDto } from './organization-contact.dto';

@Exclude()
export class LaboralExperienceDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly organizationName: string;

  @Expose()
  readonly initDate: Date;

  @Expose()
  readonly finishDate?: Date;

  @Expose()
  readonly currentJob: boolean;

  @Expose()
  readonly functionPerformed: string;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => OrganizationContactDto)
  readonly organizationContact: OrganizationContactDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
