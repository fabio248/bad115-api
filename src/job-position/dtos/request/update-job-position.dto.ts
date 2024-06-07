import { CreateJobPositionDto } from './create-job-position.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateJobPositionDto extends PartialType(
  OmitType(CreateJobPositionDto, [
    'requirements',
    'technicalSkills',
    'languageSkills',
    'address',
  ]),
) {}
