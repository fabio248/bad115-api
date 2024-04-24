import { CreateLaboralExperienceDto } from './create-laboral-experience.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateLaboralExperienceDto extends PartialType(
  CreateLaboralExperienceDto,
) {}
