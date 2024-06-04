import { CreateTestDto } from './create-test.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTestDto extends PartialType(CreateTestDto) {}
