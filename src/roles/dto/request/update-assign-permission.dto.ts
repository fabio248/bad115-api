import { ArrayMinSize, ArrayUnique, IsArray } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateAssignPermissionDto {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayUnique({ message: i18nValidationMessage('validation.ARRAY_UNIQUE') })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.ARRAY_MIN_SIZE', {
      constraint: 1,
    }),
  })
  permissionIds: string[];
}
