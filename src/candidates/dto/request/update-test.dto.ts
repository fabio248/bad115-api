import { CreateTestDto } from './create-prueba.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTestDto extends PartialType(CreateTestDto) {}
