import { i18nValidationMessage } from 'nestjs-i18n';
import { UnlockRequestStatusEnum } from '../../../auth/enums/unlock-request-status.enum';
import { IsString, ValidateIf } from 'class-validator';

export class UpdateUnlockRequestDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly status: UnlockRequestStatusEnum;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ValidateIf((value) => value === UnlockRequestStatusEnum.REJECTED)
  readonly reason?: string;
}
