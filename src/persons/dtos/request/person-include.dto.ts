import { IsBoolean, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform } from 'class-transformer';

export class PersonIncludeDto {
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @Transform(({ value }) => value === 'true')
  readonly user?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @Transform(({ value }) => value === 'true')
  readonly address?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @Transform(({ value }) => value === 'true')
  readonly documents?: boolean = true;
}
