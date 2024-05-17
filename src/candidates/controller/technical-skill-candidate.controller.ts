import { Controller } from '@nestjs/common';
import { Post, Param } from '@nestjs/common';
import { TechnicalSkillCandidateService } from '../services/technical-skill-candidate.service';

//dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
// import { CreateTechnicalSkillCandidateDto } from '../dto/request/create-technical-skill-candidate.dto';
import { TechnicalSkillCandidateDto } from '../dto/response/technical-skill-candidate.dto';
import { TechnicalSkillIdDto } from '../dto/request/technical-skill-id.dto';
import { CategoryIdDto } from '../dto/request/category-id.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Candidates Endpoints')
@Controller('candidates/tecnical-skill-candidate')
export class TecnicalSkillCandidateController {
  constructor(
    private readonly technicalSkillCandidateService: TechnicalSkillCandidateService,
  ) {}
  @Post(
    ':candidateId/technicalSkillCandidate/:technicalSkillId/category/:categoryId',
  )
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { technicalSkillId }: TechnicalSkillIdDto,
    @Param() { categoryId }: CategoryIdDto,
    // @Body() createTechnicalSkillCandidateDto: CreateTechnicalSkillCandidateDto,
  ): Promise<TechnicalSkillCandidateDto> {
    return this.technicalSkillCandidateService.create(
      candidateId,
      technicalSkillId,
      categoryId,
      // createTechnicalSkillCandidateDto,
    );
  }
}
