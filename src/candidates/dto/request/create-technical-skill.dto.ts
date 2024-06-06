import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTechnicalSkillDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly technicalSkillId: string;
}
