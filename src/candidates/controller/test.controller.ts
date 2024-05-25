import { Controller } from '@nestjs/common';
import { Post, Body, Param, Get, Delete, Query, Put } from '@nestjs/common';
import { TestService } from '../services/test.service';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

//Dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CreateTestDto } from '../dto/request/create-prueba.dto';
import { TestDto } from '../dto/response/test.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestIdDto } from '../dto/request/test-id.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateTestDto } from '../dto/request/update-test.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@Controller('candidates/:candidateId/test')
@ApiTags('Candidates Endpoints')
export class PruebaController {
  constructor(private readonly pruebaServices: TestService) {}

  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  @Post('')
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createTestDto: CreateTestDto,
  ): Promise<TestDto> {
    return this.pruebaServices.create(candidateId, createTestDto);
  }
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @Get('/:testId')
  @ApiOperation({ summary: 'Get a test by id' })
  findOne(@Param() { testId }: TestIdDto): Promise<TestDto> {
    return this.pruebaServices.findOne(testId);
  }
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  @Get('')
  @ApiPaginatedResponse(TestDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TestDto>> {
    return this.pruebaServices.findAll(candidateId, pageDto);
  }
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  @Put('/:testId')
  update(
    @Body() updateTestDto: UpdateTestDto,
    @Param() { candidateId }: CandidateIdDto,
    @Param() { testId }: TestIdDto,
  ): Promise<TestDto> {
    return this.pruebaServices.update(updateTestDto, candidateId, testId);
  }
  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete('/:testId')
  remove(@Param() { testId }: TestIdDto) {
    return this.pruebaServices.remove(testId);
  }
}
