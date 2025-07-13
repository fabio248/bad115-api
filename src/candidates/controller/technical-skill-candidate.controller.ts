import { Controller, Query, Post, Param, Get, Delete } from '@nestjs/common';
import { TechnicalSkillCandidateService } from '../services/technical-skill-candidate.service';

//dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { TechnicalSkillCandidateDto } from '../dto/response/technical-skill-candidate.dto';
import { TechnicalSkillIdDto } from '../dto/request/technical-skill-id.dto';
import { CategoryIdDto } from '../dto/request/category-id.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
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

  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @Get(':candidateId/technical-skill-candidate/technical-skill/category')
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillCandidateDto>> {
    return this.technicalSkillCandidateService.findAll(candidateId, pageDto);
  }

  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  @Delete(':candidateId/technical-skill-candidate/:technicalSkillId')
  async remove(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { technicalSkillId }: TechnicalSkillIdDto,
  ): Promise<void> {
    return this.technicalSkillCandidateService.remove(
      candidateId,
      technicalSkillId,
    );
  }

  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @Get(':candidateId/technical-skill-candidate/:technicalSkillId')
  findOne(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { technicalSkillId }: TechnicalSkillIdDto,
  ): Promise<TechnicalSkillCandidateDto> {
    return this.technicalSkillCandidateService.findOne(
      candidateId,
      technicalSkillId,
    );
  }
}
