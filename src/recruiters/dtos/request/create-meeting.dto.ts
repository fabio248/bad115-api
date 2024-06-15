import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMeetingAplicationDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUrl({}, { message: i18nValidationMessage('validation.IS_URL') })
  readonly link: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly executionDate: Date;
}
