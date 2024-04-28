import { CreateAcademicKnowledgeDto } from './create-academic-knowledge.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAcademicKnowledgeDto extends PartialType(
  CreateAcademicKnowledgeDto,
) {}
