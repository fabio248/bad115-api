import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';
import { EL_SALVADOR } from '../../../common/utils/constants';

export class CreateAddressDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly street: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly numberHouse: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  readonly countryId: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly countryName: string;

  /**
   * Sent only if the country is El Salvador
   */
  @ValidateIf((obj) => obj.countryName === EL_SALVADOR)
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  readonly departmentId?: string;

  /**
   * Sent only if the country is El Salvador
   */
  @ValidateIf((obj) => obj.countryName === 'El Salvador')
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  readonly municipalityId?: string;
}
