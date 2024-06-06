import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TechnicalSkillDto } from '../../../catalogs/dtos/response/technical-skill.dto';

@Exclude()
export class TechnicalSkillCandidateDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly candidateId?: string;

  @Expose()
  @Type(() => TechnicalSkillDto)
  readonly technicalSkill?: TechnicalSkillDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
