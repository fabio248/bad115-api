import { Controller } from '@nestjs/common';
import { Post, Param } from '@nestjs/common';
import { TechnicalSkillCandidateService } from '../services/technical-skill-candidate.service';

//dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { TechnicalSkillCandidateDto } from '../dto/response/technical-skill-candidate.dto';
import { TechnicalSkillIdDto } from '../dto/request/technical-skill-id.dto';
import { CategoryIdDto } from '../dto/request/category-id.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Candidates Endpoints')
@Controller('candidates/')
export class TecnicalSkillCandidateController {
  constructor(
    private readonly technicalSkillCandidateService: TechnicalSkillCandidateService,
  ) {}
  @Post(
    ':candidateId/technical-skill-candidate/:technicalSkillId/category/:categoryId',
  )
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { technicalSkillId }: TechnicalSkillIdDto,
    @Param() { categoryId }: CategoryIdDto,
  ): Promise<TechnicalSkillCandidateDto> {
    return this.technicalSkillCandidateService.create(
      candidateId,
      technicalSkillId,
      categoryId,
    );
  }
}
