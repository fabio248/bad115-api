import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryTechnicalSkillDto } from './category-technical-skill.dto';

@Exclude()
export class TechnicalSkillDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly categoryTechnicalSkillId: string;

  @Expose()
  @Type(() => CategoryTechnicalSkillDto)
  readonly categoryTechnicalSkill?: CategoryTechnicalSkillDto;
}
