import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AcademicKnowledgeService } from '../services/academic-knowledge.service';
import { CreateAcademicKnowledgeDto } from '../dto/request/create-academic-knowledge.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { AcademicKnowledgeDto } from '../dto/response/academic-knowledge.dto';
import { AcademicKnowlodgeIdDto } from '../dto/request/academic-knowledge-id.dto';
import { UpdateAcademicKnowledgeDto } from '../dto/request/update-academic-knowledge.dto';
//pagination
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from '../../common/dtos/request/page.dto';

@ApiTags('Candidates Endpoints')
@Controller('candidates')
export class AcademicKnowledgeController {
  constructor(
    private readonly academicKnowledgeService: AcademicKnowledgeService,
  ) {}

  @ApiOperation({
    summary:
      'Use this endpoint to create an academic knowledge for candidate id',
  })
  @Post(':candidateId/academic-knowledge')
  // @ApiErrorResponse([])
  create(
    @Body() createAcademicKnowledge: CreateAcademicKnowledgeDto,
    @Param() { candidateId }: CandidateIdDto,
  ): Promise<AcademicKnowledgeDto> {
    return this.academicKnowledgeService.create(
      createAcademicKnowledge,
      candidateId,
    );
  }

  @ApiOperation({
    summary: 'Use this endpoint to search an academic knowledge by id',
  })
  @Get('/candidateId/:academicKnowledgeId')
  findOne(
    @Param() { academicKnowledgeId }: AcademicKnowlodgeIdDto,
  ): Promise<AcademicKnowledgeDto> {
    return this.academicKnowledgeService.findOne(academicKnowledgeId);
  }

  @Get('/:candidateId/academicKnowledgeId')
  @ApiOperation({
    summary:
      'Use this endpoint to search all academicKnowledges asignered a one user',
  })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<AcademicKnowledgeDto>> {
    return this.academicKnowledgeService.findAll(candidateId, pageDto);
  }

  @Put('/:candidateId/academicKnowledge/:academicKnowledgeId')
  @ApiOperation({
    summary: 'Use this endpoint to update academicKnowledges ',
  })
  update(
    @Body() updateAcademicKnowledge: UpdateAcademicKnowledgeDto,
    @Param() { candidateId }: CandidateIdDto,
    @Param() { academicKnowledgeId }: AcademicKnowlodgeIdDto,
  ): Promise<AcademicKnowledgeDto> {
    return this.academicKnowledgeService.update(
      updateAcademicKnowledge,
      academicKnowledgeId,
      candidateId,
    );
  }
  @Delete('/candidateIds/academicKnowledge/:academicKnowledgeId')
  remove(@Param() { academicKnowledgeId }: AcademicKnowlodgeIdDto) {
    return this.academicKnowledgeService.remove(academicKnowledgeId);
  }
}
