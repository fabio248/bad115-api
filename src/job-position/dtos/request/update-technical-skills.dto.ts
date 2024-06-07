import { CreateTechnicalSkillPositionDto } from './create-technical-skill-position.dto';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsArray } from 'class-validator';

export class UpdateTechnicalSkillsDto {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly technicalSkills: CreateTechnicalSkillPositionDto[];
}
