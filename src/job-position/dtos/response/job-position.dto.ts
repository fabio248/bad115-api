import { Exclude, Expose, Type } from 'class-transformer';
import {
  ContractTypeEnum,
  ExperienceLevelEnum,
  ModalityEnum,
  StatusEnum,
  WorkdayEnum,
} from '../../enums';
import { CompanyDto } from '../../../companies/dtos/response/company.dto';
import { AddressDto } from '../../../persons/dtos/response/address.dto';
import { TechnicalSkillCandidateDto } from '../../../candidates/dto/response/technical-skill-candidate.dto';
import { LanguageSkillDto } from '../../../candidates/dto/response/language-skill.dto';

@Exclude()
export class RequirementDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly description: string;
}

@Exclude()
export class JobPositionDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly salaryRange: string;

  @Expose()
  readonly modality: ModalityEnum;

  @Expose()
  readonly description: string;

  @Expose()
  readonly experiencesLevel: ExperienceLevelEnum;

  @Expose()
  readonly contractType: ContractTypeEnum;

  @Expose()
  readonly status: StatusEnum;

  @Expose()
  readonly closeTime: Date;

  @Expose()
  readonly workday: WorkdayEnum;

  @Expose()
  @Type(() => CompanyDto)
  readonly company: CompanyDto;

  @Expose()
  @Type(() => AddressDto)
  readonly address: AddressDto;

  @Expose()
  @Type(() => TechnicalSkillCandidateDto)
  readonly technicalSkills: TechnicalSkillCandidateDto[];

  @Expose()
  @Type(() => LanguageSkillDto)
  readonly languageSkills: LanguageSkillDto[];

  @Expose()
  @Type(() => RequirementDto)
  requirements: RequirementDto[];

  @Expose()
  createdAt: Date;
}
