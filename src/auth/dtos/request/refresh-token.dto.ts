import { IsNotEmpty, IsString, IsJWT } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshLoginDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsJWT({ message: i18nValidationMessage('validation.IS_VALID_TOKEN') })
  refreshToken: string;
}
