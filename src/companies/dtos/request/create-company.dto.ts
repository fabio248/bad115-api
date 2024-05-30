import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CompanySizeEnum } from '../../enums/company-size.enum';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export class CreateCompanyDto {
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('VALIDATION.IS_NOT_EMPTY') })
  readonly name: string;

  @IsString({ message: i18nValidationMessage('VALIDATION.IS_ENUM') })
  @IsNotEmpty({ message: i18nValidationMessage('VALIDATION.IS_NOT_EMPTY') })
  readonly size: CompanySizeEnum;

  @IsNotEmpty({ message: i18nValidationMessage('VALIDATION.IS_NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('VALIDATION.IS_UUID') })
  readonly countryId: string;

  @IsNotEmpty({ message: i18nValidationMessage('VALIDATION.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;

  @IsNotEmpty({ message: i18nValidationMessage('VALIDATION.IS_NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('VALIDATION.IS_EMAIL') })
  readonly email: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  readonly description?: string;

  @IsOptional()
  @IsUrl({}, { message: i18nValidationMessage('VALIDATION.IS_URL') })
  readonly website?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  readonly phone?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  readonly logo?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  readonly type?: string;
}
