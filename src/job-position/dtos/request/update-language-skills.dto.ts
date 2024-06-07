import { CreateLanguageSkillDto } from '../../../candidates/dto/request/create-language-skill.dto';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsArray } from 'class-validator';

export class UpdateLanguageSkillsDto {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly languageSkills: CreateLanguageSkillDto[];
}
