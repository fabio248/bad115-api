import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { JobAplicationEnum } from 'src/job-application/enums/job-aplication.enum';

export class CreateJobAplicationDto {
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

  /**
   * Si no se proporciona el tipo de archivo, se asume que no se subirá archivo y no se retornará la url para la subida del archivo
   * En caso de que se proporcione el tipo de archivo, se retornará la url para subir el archivo
   * @example 'application/pdf'
   */
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  mimeTypeFile?: string;
}
