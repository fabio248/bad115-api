import { IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AddressIdDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  readonly addressId: string;
}
