import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsEnum } from 'class-validator';
import {
  LanguagueLevelEnum,
  LanguagueSkillsEnum,
} from '../../enums/language-skills.enum';
import { CreateLanguageDto } from './create-language.dto';
import { Type } from 'class-transformer';

export class CreateAcademicKnowledgeDto {
  /*Enum:
     // Enum: Escucha, lectura, escritura y conversacion
     */
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(['Titulo', 'Diploma', 'Cursos'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly skill: LanguagueSkillsEnum;
  /*Enum:
   A1 = "A1", A2 = "A2", B1 = "B1", B2 = "B2", C1 = "C1", C2 = "C2"
   */
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(['Titulo', 'Diploma', 'Cursos'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly level: LanguagueLevelEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => CreateLanguageDto)
  readonly language?: CreateLanguageDto;
}
