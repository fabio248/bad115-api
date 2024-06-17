import { IsOptional, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  ContractTypeEnum,
  ExperienceLevelEnum,
  ModalityEnum,
  WorkdayEnum,
} from '../../enums';

export class JobPositionFilterDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly countryId?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly departmentId?: string;

  @IsOptional()
  readonly modality?: ModalityEnum[] = [];

  @IsOptional()
  readonly contractType?: ContractTypeEnum[] = [];

  @IsOptional()
  readonly experiencesLevel?: ExperienceLevelEnum[] = [];

  @IsOptional()
  readonly workday?: WorkdayEnum[] = [];

  /**
   * Si se proporciona el valor true, se retornarán las posiciones de trabajo que estén disponibles, que tengan el 'closeTime' mayor o igual a la fecha actual.
   */
  @IsOptional()
  readonly available?: string = 'true';

  @IsOptional()
  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  readonly companyId?: string;
}
