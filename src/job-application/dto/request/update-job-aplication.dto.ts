import { PartialType } from '@nestjs/swagger';
import { CreateJobAplicationDto } from './create-job-aplication.dto';
export class UpdateJobAplicationDto extends PartialType(
  CreateJobAplicationDto,
) {}
