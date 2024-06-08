import { IsBoolean, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePrivacySettingsDto {
  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  laboralExperiences?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  academicKnowledges?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  certifications?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  technicalSkills?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  languageSkills?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  recognitions?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  publications?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  participations?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  tests?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  recomendations?: boolean;
  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  address?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  documents?: boolean;

  /**
   * @example false
   */
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  socialNetwork?: boolean;
}
