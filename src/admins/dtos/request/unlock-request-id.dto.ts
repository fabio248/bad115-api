import { i18nValidationMessage } from 'nestjs-i18n';
import { IsString, IsUUID } from 'class-validator';

export class UnlockRequestIdDto {
  @IsUUID(4, { message: i18nValidationMessage('validation.IS_UUID') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly unlockRequestId: string;
}
