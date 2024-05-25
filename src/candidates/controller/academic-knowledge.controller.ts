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
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@ApiTags('Candidates Endpoints')
@Controller('candidates/:candidateId/academic-knowledge')
export class AcademicKnowledgeController {
  constructor(
    private readonly academicKnowledgeService: AcademicKnowledgeService,
  ) {}

  @ApiOperation({
    summary:
      'Use this endpoint to create an academic knowledge for candidate id',
  })
  @Post('')
  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
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
  @Get('/:academicKnowledgeId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(
    @Param() { academicKnowledgeId }: AcademicKnowlodgeIdDto,
  ): Promise<AcademicKnowledgeDto> {
    return this.academicKnowledgeService.findOne(academicKnowledgeId);
  }

  @Get('')
  @ApiOperation({
    summary:
      'Use this endpoint to search all academicKnowledges asignered a one user',
  })
  @ApiPaginatedResponse(AcademicKnowledgeDto)
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<AcademicKnowledgeDto>> {
    return this.academicKnowledgeService.findAll(candidateId, pageDto);
  }

  @Put('/:academicKnowledgeId')
  @ApiOperation({
    summary: 'Use this endpoint to update academicKnowledges ',
  })
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
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
  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete('/:academicKnowledgeId')
  remove(@Param() { academicKnowledgeId }: AcademicKnowlodgeIdDto) {
    return this.academicKnowledgeService.remove(academicKnowledgeId);
  }
}
