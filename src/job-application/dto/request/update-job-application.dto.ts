import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { JobAplicationEnum } from 'src/job-application/enums/job-aplication.enum';

export class UpdateJobApplicationDto {
  /*Enum:
     // Enum: Escucha, lectura, escritura y conversacion
     */
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(JobAplicationEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status: JobAplicationEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  recomendation?: string;
}
