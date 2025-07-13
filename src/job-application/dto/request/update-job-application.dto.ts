import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { JobAplicationEnum } from '../../enums/job-aplication.enum';

export class UpdateJobApplicationDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(JobAplicationEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status: JobAplicationEnum;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  recomendation?: string;
}
