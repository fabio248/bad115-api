import { PartialType } from '@nestjs/swagger';
import { CreateRecognitionTypesDto } from './create-recognition-types.dto';

export class UpdateParticipationTypesDto extends PartialType(
  CreateRecognitionTypesDto,
) {}
