import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { TypeAcademicKnowledge } from '../../enums/typeAcademicKnowledge.enum';

@Exclude()
export class AcademicKnowledgeDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly type: TypeAcademicKnowledge;

  @Expose()
  readonly organizationName: string;

  @Expose()
  readonly initDate: Date;

  @Expose()
  readonly finishDate?: Date;

  @Expose()
  readonly candidateId: string;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
