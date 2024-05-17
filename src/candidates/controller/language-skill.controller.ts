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

@Controller('candidates/language-skill')
@ApiTags('Candidates Endpoints')
export class LanguageSkillController {
  constructor(private readonly languageSkillService: LanguageSkillService) {}

  @ApiOperation({
    summary:
      'Use this endpoint to create an academic knowledge for candidate id',
  })
  @Post(':candidateId/language-skill')
  // @ApiErrorResponse([])
  create(
    @Body() createAcademicKnowledge: CreateLanguageSkillDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<CreateLanguageSkillDto> {
    return this.languageSkillService.create(
      createAcademicKnowledge,
      candidateId,
    );
  }

  @ApiOperation({
    summary: 'Use this endpoint to search an languageSkill by id',
  })
  @Get('/candidateId/:languageSkillId')
  findOne(
    @Param() { languageSkillId }: LanguageSkillIdDto,
  ): Promise<CreateLanguageSkillDto> {
    return this.languageSkillService.findOne(languageSkillId);
  }

  @Get('/:candidateId/languageSkillId')
  @ApiOperation({
    summary:
      'Use this endpoint to search all language skills asignered a one user',
  })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<LanguageSkillDto>> {
    return this.languageSkillService.findAll(candidateId, pageDto);
  }

  @ApiOperation({
    summary: 'Use this endpoint to update language skills asignered',
  })
  @Put(':candidateId/languageSkill/:languageSkillId')
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
  @Delete('/candidateId/languageSkill/:languageSkillId')
  remove(@Param() { languageSkillId }: LanguageSkillIdDto) {
    return this.languageSkillService.remove(languageSkillId);
  }
}
