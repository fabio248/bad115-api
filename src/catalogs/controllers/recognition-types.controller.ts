import { RecognitionTypesService } from '../services/recognition-types.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { RecognitionTypesDto } from '../dtos/response/recognition-types.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { PageDto } from '../../common/dtos/request/page.dto';
import { RecognitionTypesIdDto } from '../dtos/request/recognition-types-id.dto';
import { CreateRecognitionTypesDto } from '../dtos/request/create-recognition-types.dto';
import { UpdateParticipationTypesDto } from '../dtos/request/update-participation-types.dto';

@ApiTags('Recognition Types Endpoints')
@Controller('catalogs/recognition-types')
export class RecognitionTypesController {
  constructor(
    private readonly recognitionTypesService: RecognitionTypesService,
  ) {}

  @Get()
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findAll(): Promise<RecognitionTypesDto[]> {
    return this.recognitionTypesService.findAll();
  }

  @Get('paginated')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  @ApiPaginatedResponse(RecognitionTypesDto)
  async findAllPaginated(@Param() pageDto: PageDto) {
    return this.recognitionTypesService.findAllPaginated(pageDto);
  }

  @Get(':recognitionTypeId')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findById(
    @Param() { recognitionTypeId }: RecognitionTypesIdDto,
  ): Promise<RecognitionTypesDto> {
    return this.recognitionTypesService.findById(recognitionTypeId);
  }

  @Post()
  @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  async create(
    @Body() createRecognitionTypesDto: CreateRecognitionTypesDto,
  ): Promise<RecognitionTypesDto> {
    return this.recognitionTypesService.create(createRecognitionTypesDto);
  }

  @Put(':recognitionTypeId')
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  async update(
    @Param() { recognitionTypeId }: RecognitionTypesIdDto,
    @Body() updateRecognitionTypesDto: UpdateParticipationTypesDto,
  ): Promise<RecognitionTypesDto> {
    return this.recognitionTypesService.update(
      recognitionTypeId,
      updateRecognitionTypesDto,
    );
  }

  @Delete(':recognitionTypeId')
  @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  async delete(
    @Param() { recognitionTypeId }: RecognitionTypesIdDto,
  ): Promise<RecognitionTypesDto> {
    return this.recognitionTypesService.delete(recognitionTypeId);
  }
}
