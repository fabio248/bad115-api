import { IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AddRecruiterCompanyDto {
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly email: string;
}
