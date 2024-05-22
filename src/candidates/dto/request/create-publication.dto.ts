import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { PublicationEnum } from 'src/candidates/enums/publication.enum';

export class CreatePublicationDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly place: string;

  /*
  Enum: articulo, libro
  */
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(PublicationEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly type: PublicationEnum;

  // Cuando se elija Libro deberá mostrar los demás campos "ISBN" y "EDICIÓN"

  /**
   * Sent only if the type is Libro
   */
  @ValidateIf((obj) => obj.type === PublicationEnum.Libro)
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional({ message: i18nValidationMessage('validation.IS_OPTIONAL') })
  isbn?: string;

  @ValidateIf((obj) => obj.type == PublicationEnum.Libro)
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional({ message: i18nValidationMessage('validation.IS_OPTIONAL') })
  edition?: string;
}
