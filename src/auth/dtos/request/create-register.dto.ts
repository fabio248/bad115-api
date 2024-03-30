import { CreatePersonDto } from '../../../persons/dtos/request/create-person.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export class CreateRegisterDto extends CreatePersonDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  readonly email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;
}
