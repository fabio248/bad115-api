import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { RecomendationEnum } from 'src/candidates/enums/recomendation-enum';

export class CreateRecomendationDto {
  /*
  Enum: Laboral, Personal
  */
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(RecomendationEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly type: RecomendationEnum;

  @IsOptional({ message: i18nValidationMessage('validation.IS_OPTIONAL') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly recomendation?: string;
}
