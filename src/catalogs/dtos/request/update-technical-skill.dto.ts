import { PartialType } from '@nestjs/swagger';
import { CreateTechnicalSkillDto } from './create-technical-skill.dto';

export class UpdateTechnicalSkillTypeDto extends PartialType(
  CreateTechnicalSkillDto,
) {}
