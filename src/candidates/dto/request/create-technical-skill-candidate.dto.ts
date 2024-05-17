import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty } from 'class-validator';
import { CreateTechnicalSkillDto } from './create-technical-skill.dto';
import { Type } from 'class-transformer';

export class CreateTechnicalSkillCandidateDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => CreateTechnicalSkillDto)
  readonly technicalSkill?: CreateTechnicalSkillDto;
}
