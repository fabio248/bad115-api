import { StatusEnum } from '../../enums';
import { CreateJobPositionDto } from './create-job-position.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateJobPositionDto extends PartialType(
  OmitType(CreateJobPositionDto, [
    'requirements',
    'technicalSkills',
    'languageSkills',
    'address',
  ]),
) {
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status?: StatusEnum;
}
