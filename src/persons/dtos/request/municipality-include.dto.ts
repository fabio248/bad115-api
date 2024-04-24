import { IsBoolean, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform } from 'class-transformer';

export class MunicipalityIncludeDto {
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @Transform(({ value }) => value === 'true')
  readonly department?: boolean = false;
}
