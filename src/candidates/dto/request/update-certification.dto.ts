import { CreateCertificationDto } from './create-certification.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCertificationDto extends PartialType(
  CreateCertificationDto,
) {}
