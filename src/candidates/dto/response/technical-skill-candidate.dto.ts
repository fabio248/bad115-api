import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateTechnicalSkillDto } from '../request/create-technical-skill.dto';

@Exclude()
export class TechnicalSkillCandidateDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => CreateTechnicalSkillDto)
  readonly technicalSkill?: CreateTechnicalSkillDto;

  // @Expose()
  // @Type(() => CreateCategoryDto)
  // readonly category?: CreateCategoryDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
