import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequirementDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly description: string;
}
