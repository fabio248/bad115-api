import { CreateRecomendationDto } from './create-recomendation.dto';

import { PartialType } from '@nestjs/swagger';

export class UpdateRecomendationDto extends PartialType(
  CreateRecomendationDto,
) {}
