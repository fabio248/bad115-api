import { CreateLanguageSkillDto } from './create-language-skill.dto';

import { PartialType } from '@nestjs/swagger';

export class UpdateLanguageSkillDto extends PartialType(
  CreateLanguageSkillDto,
) {}
