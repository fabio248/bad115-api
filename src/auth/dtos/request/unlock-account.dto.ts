import { IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UnlockAccountDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  readonly email: string;
}
