import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Post, Body, Param, Get, Put, Delete, Query } from '@nestjs/common';
import { CreateLanguageSkillDto } from '../dto/request/create-language-skill.dto';
import { LanguageSkillService } from '../services/language-skill.service';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { LanguageSkillIdDto } from '../dto/request/language-skill-id.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { LanguageSkillDto } from '../dto/response/language-skill.dto';
import { UpdateLanguageSkillDto } from '../dto/request/update-language-skill.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@Controller('candidates/:candidateId/language-skills')
@ApiTags('Candidates Endpoints')
export class LanguageSkillController {
  constructor(private readonly languageSkillService: LanguageSkillService) {}

  @ApiOperation({
    summary:
      'Use this endpoint to create an academic knowledge for candidate id',
  })
  @Post('')
  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  create(
    @Body() createAcademicKnowledge: CreateLanguageSkillDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<LanguageSkillDto> {
    return this.languageSkillService.create(
      createAcademicKnowledge,
      candidateId,
    );
  }

  @ApiOperation({
    summary: 'Use this endpoint to search an languageSkill by id',
  })
  @Get('/:languageSkillId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(
    @Param() { languageSkillId }: LanguageSkillIdDto,
  ): Promise<LanguageSkillDto> {
    return this.languageSkillService.findOne(languageSkillId);
  }

  @Get('')
  @ApiOperation({
    summary:
      'Use this endpoint to search all language skills asignered a one user',
  })
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @ApiPaginatedResponse(LanguageSkillDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<LanguageSkillDto>> {
    return this.languageSkillService.findAll(candidateId, pageDto);
  }

  @ApiOperation({
    summary: 'Use this endpoint to update language skills asignered',
  })
  @Put('/:languageSkillId')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  update(
    @Body() updateAcademicKnowledge: UpdateLanguageSkillDto,
    @Param() { candidateId }: CandidateIdDto,
    @Param() { languageSkillId }: LanguageSkillIdDto,
  ): Promise<LanguageSkillDto> {
    return this.languageSkillService.update(
      updateAcademicKnowledge,
      languageSkillId,
      candidateId,
    );
  }

  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete('/:languageSkillId')
  remove(@Param() { languageSkillId }: LanguageSkillIdDto) {
    return this.languageSkillService.remove(languageSkillId);
  }
}
