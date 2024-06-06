import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import {
  LanguageLevelEnum,
  LanguageSkillsEnum,
} from '../../enums/language-skills.enum';

export class CreateLanguageSkillDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(LanguageSkillsEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly skill: LanguageSkillsEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(LanguageLevelEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly level: LanguageLevelEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly languageId: string;
}
