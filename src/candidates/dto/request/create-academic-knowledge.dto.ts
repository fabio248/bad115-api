import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AcademicKnowledgeEnum } from '../../enums/academic-knowledge.enum';

export class CreateAcademicKnowledgeDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  /*Enum:
   titulo = titulo, diploma = diploma, cursos = cursos
   */
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(['Titulo', 'Diploma', 'Cursos'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly type: AcademicKnowledgeEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.IS_DATE_STRING') },
  )
  readonly initDate: Date;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsOptional()
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.IS_DATE_STRING') },
  )
  readonly finishDate?: Date;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly organizationName: string;
}
