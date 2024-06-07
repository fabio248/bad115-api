import { CreateRequirementDto } from './create-requirement.dto';
import { IsArray } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateRequirementDto {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly requirements: CreateRequirementDto[];
}
