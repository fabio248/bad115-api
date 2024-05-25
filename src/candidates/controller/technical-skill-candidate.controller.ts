import { Controller, Query, Post, Param, Get } from '@nestjs/common';
import { TechnicalSkillCandidateService } from '../services/technical-skill-candidate.service';

//dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { TechnicalSkillCandidateDto } from '../dto/response/technical-skill-candidate.dto';
import { TechnicalSkillIdDto } from '../dto/request/technical-skill-id.dto';
import { CategoryIdDto } from '../dto/request/category-id.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
@ApiTags('Candidates Endpoints')
@Controller('candidates/')
export class TecnicalSkillCandidateController {
  constructor(
    private readonly technicalSkillCandidateService: TechnicalSkillCandidateService,
  ) {}
  @Post(
    ':candidateId/technical-skill-candidate/:technicalSkillId/category/:categoryId',
  )
  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
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

  @Get(':candidateId/technical-skill-candidate/technical-skill/category')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillCandidateDto>> {
    return this.technicalSkillCandidateService.findAll(candidateId, pageDto);
  }
}
