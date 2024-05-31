import { PartialType } from '@nestjs/swagger';
import { CreateParticipationTypesDto } from './create-participation-types.dto';

export class UpdateParticipationTypeDto extends PartialType(
  CreateParticipationTypesDto,
) {}
