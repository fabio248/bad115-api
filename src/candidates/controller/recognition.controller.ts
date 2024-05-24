import { Controller, Get } from '@nestjs/common';
import { Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecognitionService } from '../services/recognition.service';

//dto's
import { CreateRecognitionDto } from '../dto/request/create-recognition.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { RecognitionDto } from '../dto/response/recognition.dto';
import { RecognitionIdDto } from '../dto/request/recognition-id.dto';
import { UpdateRecognitionDto } from '../dto/request/update-recognition.dto';

//paginations
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@Controller('candidates/:candidateId/recognition')
@ApiTags('Candidates Endpoints')
export class RecognitionController {
  constructor(private readonly recognitionService: RecognitionService) {}

  @Post('')
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createRecognitionDto: CreateRecognitionDto,
  ): Promise<RecognitionDto> {
    return this.recognitionService.create(candidateId, createRecognitionDto);
  }

  @Get('/:recognitionId')
  findOne(
    @Param() { recognitionId }: RecognitionIdDto,
  ): Promise<RecognitionDto> {
    return this.recognitionService.findOne(recognitionId);
  }

  @Get('')
  @ApiPaginatedResponse(RecognitionDto)
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<RecognitionDto>> {
    return this.recognitionService.findAll(candidateId, pageDto);
  }

  @Put('/:recognitionId')
  update(
    @Body() updateRecognitionDto: UpdateRecognitionDto,
    @Param() { recognitionId }: RecognitionIdDto,
  ): Promise<RecognitionDto> {
    return this.recognitionService.update(updateRecognitionDto, recognitionId);
  }

  @Delete('/:recognitionId')
  remove(@Param() { recognitionId }: RecognitionIdDto) {
    return this.recognitionService.remove(recognitionId);
  }
}
