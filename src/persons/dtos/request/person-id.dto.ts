import { IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PersonIdDto {
  @IsUUID(4, { message: i18nValidationMessage('validation.IS_UUID') })
  personId: string;
}
