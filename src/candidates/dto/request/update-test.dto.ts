import { CreateTestDto } from './create-test.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateTestDto extends PartialType(
  OmitType(CreateTestDto, ['mimeTypeFile']),
) {}
