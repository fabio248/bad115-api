import { IsIn, IsOptional, IsString } from 'class-validator';
import { getSortOptions } from '../../../common/utils/sort.utils';
import { UserDto } from '../response/user.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserFilterDto {
  @IsIn(getSortOptions<UserDto>(['createdAt', { person: 'firstName' }]))
  readonly sort?: string = 'createdAt-asc';

  /**
   * Este se aplicará en la búsqueda de usuarios nombres y apellidos persona, email y nombre de compañia para los usuarios de tipo empresa.
   */
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  readonly search?: string;
}
