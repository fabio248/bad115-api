import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DocumentTypeEnum } from '../../enums/document-type.enum';

export class UpsertDocumentDto {
  @IsOptional()
  readonly id?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_ENUM') })
  readonly type: DocumentTypeEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly number: string;
}
