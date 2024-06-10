import { i18nValidationMessage } from 'nestjs-i18n';
import { IsOptional, IsString } from 'class-validator';

export class FilterTechnicalSkillDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly search?: string;
}
