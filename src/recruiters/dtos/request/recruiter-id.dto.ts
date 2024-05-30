import { IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RecruiterIdDto {
  @IsUUID(4, { message: i18nValidationMessage('validation.IS_UUID') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly recruiterId: string;
}
