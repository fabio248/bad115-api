import { Exclude, Expose } from 'class-transformer';
import {
  LanguagueLevelEnum,
  LanguagueSkillsEnum,
} from 'src/candidates/enums/language-skills.enum';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateLanguageDto } from '../request/create-language.dto';
@Exclude()
export class LanguageSkillDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly skill: LanguagueSkillsEnum;

  @Expose()
  readonly level: LanguagueLevelEnum;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => CreateLanguageDto)
  readonly language?: CreateLanguageDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
