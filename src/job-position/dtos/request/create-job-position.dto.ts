import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateAddressDto } from '../../../persons/dtos/request/create-address.dto';
import { Type } from 'class-transformer';
import { CreateRequirementDto } from './create-requirement.dto';
import { CreateLanguageSkillDto } from '../../../candidates/dto/request/create-language-skill.dto';
import {
  ContractTypeEnum,
  ExperienceLevelEnum,
  ModalityEnum,
  WorkdayEnum,
} from '../../enums';
import { CreateTechnicalSkillPositionDto } from './create-technical-skill-position.dto';

export class CreateJobPositionDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly name: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly salaryRange: string;

  @IsEnum(ModalityEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.') })
  readonly modality: ModalityEnum;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly description: string;

  @IsEnum(ContractTypeEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly contractType: ContractTypeEnum;

  @IsEnum(ExperienceLevelEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly experiencesLevel: ExperienceLevelEnum;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(WorkdayEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly workday: WorkdayEnum;

  @IsUUID('4', { message: i18nValidationMessage('validation.IS_UUID') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly companyId: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.IS_DATE_STRING') },
  )
  readonly closeTime: Date;

  @IsOptional()
  @Type(() => CreateAddressDto)
  readonly address?: CreateAddressDto;

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly requirements: CreateRequirementDto[] = [];

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly languageSkills: CreateLanguageSkillDto[] = [];

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly technicalSkills: CreateTechnicalSkillPositionDto[] = [];
}
