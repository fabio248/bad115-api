import { IsNotEmpty, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTechnicalSkillPositionDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  readonly technicalSkillId: string;
}
