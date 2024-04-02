import { i18nValidationMessage } from 'nestjs-i18n';
import { IsUUID } from 'class-validator';

export class CandidateIdDto {
  @IsUUID(4, { message: i18nValidationMessage('validation.IS_UUID') })
  candidateId: string;
}
