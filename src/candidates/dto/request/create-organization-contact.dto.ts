import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateOrganizationContactDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  phone: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  email: string;
}
