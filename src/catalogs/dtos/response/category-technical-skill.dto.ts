import { Exclude, Expose, Type } from 'class-transformer';
import { TechnicalSkillDto } from './technical-skill.dto';

@Exclude()
export class CategoryTechnicalSkillDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => TechnicalSkillDto)
  readonly technicalSkill?: TechnicalSkillDto[];
}
