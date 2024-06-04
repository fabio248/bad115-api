import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  result: string;

  /**
   * Si no se proporciona el tipo de archivo, se asume que no se subirá archivo y no se retornará la url para la subida del archivo
   * En caso de que se proporcione el tipo de archivo, se retornará la url para subir el archivo
   * @example 'application/pdf'
   */
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  mimeTypeFile?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  testTypeId: string;
}
