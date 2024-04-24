import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AcademicKnowledgeService } from '../services/academic-knowledge.service';
import { CreateAcademicKnowledgeDto } from '../dto/request/create-academic-knowledge.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { AcademicKnowledgeDto } from '../dto/response/academic-knowledge.dto';

@ApiTags('Candidates Endpoints')
@Controller('candidates')
export class AcademicKnowledgeController {
  constructor(
    private readonly academicKnowledgeService: AcademicKnowledgeService,
  ) {}

  @Post(':candidateId/academic-knowledge')
  // @ApiErrorResponse([])
  createAcademicKnowledge(
    @Body() createAcademicKnowledge: CreateAcademicKnowledgeDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<AcademicKnowledgeDto> {
    return this.academicKnowledgeService.create(
      createAcademicKnowledge,
      candidateId,
    );
  }
}
