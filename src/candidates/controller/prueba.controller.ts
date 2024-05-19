import { Controller } from '@nestjs/common';
import { Post, Body, Param, Get, Delete, Query, Put } from '@nestjs/common';
import { PruebaService } from '../services/prueba.service';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

//Dto's
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CreateTestDto } from '../dto/request/create-prueba.dto';
import { TestDto } from '../dto/response/test.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PruebaIdDto } from '../dto/request/prueba-id.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { UpdateTestDto } from '../dto/request/update-test.dto';

@Controller('candidates/:candidateId/prueba')
@ApiTags('Candidates Endpoints')
export class PruebaController {
  constructor(private readonly pruebaServices: PruebaService) {}

  @Post('')
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createTestDto: CreateTestDto,
  ): Promise<TestDto> {
    return this.pruebaServices.create(candidateId, createTestDto);
  }

  @Get('/:pruebaId')
  @ApiOperation({ summary: 'Get a test by id' })
  findOne(@Param() { pruebaId }: PruebaIdDto): Promise<TestDto> {
    return this.pruebaServices.findOne(pruebaId);
  }

  @Get('')
  @ApiPaginatedResponse(TestDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TestDto>> {
    return this.pruebaServices.findAll(candidateId, pageDto);
  }

  @Put('/:pruebaId')
  update(
    @Body() updateTestDto: UpdateTestDto,
    @Param() { candidateId }: CandidateIdDto,
    @Param() { pruebaId }: PruebaIdDto,
  ): Promise<TestDto> {
    return this.pruebaServices.update(updateTestDto, candidateId, pruebaId);
  }

  @Delete('/:pruebaId')
  remove(@Param() { pruebaId }: PruebaIdDto) {
    return this.pruebaServices.remove(pruebaId);
  }
}
