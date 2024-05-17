import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateParticipationTypeDto } from './create-participation-type.dto';

export class CreateParticipationDto {
  /**
   * @example '2024-03-07T03:17:32.410Z'
   */
  @IsDateString({}, { message: i18nValidationMessage('validation.IS_DATE') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  date: Date;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  place: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  country: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  eventHost: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => CreateParticipationTypeDto)
  readonly participacionType?: CreateParticipationTypeDto;
}
