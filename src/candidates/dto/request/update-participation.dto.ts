import { CreateParticipationDto } from './create-participation.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateParticipationDto extends PartialType(
  CreateParticipationDto,
) {}
