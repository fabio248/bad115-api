import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PrivacySettingIdDto {
  @IsUUID(4, { message: i18nValidationMessage('validation.IS_UUID') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly privacySettingId: string;
}
