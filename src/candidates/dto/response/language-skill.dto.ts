import { Exclude, Expose } from 'class-transformer';
import {
  LanguageLevelEnum,
  LanguageSkillsEnum,
} from 'src/candidates/enums/language-skills.enum';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LanguageTypesDto } from '../../../catalogs/dtos/response/language-type.dto';

@Exclude()
export class LanguageSkillDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly skill: LanguageSkillsEnum;

  @Expose()
  readonly level: LanguageLevelEnum;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => LanguageTypesDto)
  readonly language: LanguageTypesDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
