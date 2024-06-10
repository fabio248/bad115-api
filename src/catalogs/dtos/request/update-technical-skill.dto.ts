import { PartialType } from '@nestjs/swagger';
import { CreateTechnicalSkillDto } from './create-technical-skill.dto';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateTechnicalSkillTypeDto extends PartialType(
  CreateTechnicalSkillDto,
) {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly categoryTechnicalSkillId?: string;
}
