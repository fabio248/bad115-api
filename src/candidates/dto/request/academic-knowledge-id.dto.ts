import { i18nValidationMessage } from 'nestjs-i18n';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class AcademicKnowlodgeIdDto {
  @IsUUID(4, { message: i18nValidationMessage('validation.IS_UUID') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  academicKnowledgeId: string;
}
