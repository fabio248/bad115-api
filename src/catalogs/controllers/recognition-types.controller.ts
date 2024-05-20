import { RecognitionTypesService } from '../services/recognition-types.service';
import { Controller, Get } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { RecognitionTypesDto } from '../dtos/response/recognition-types.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Catalogs Endpoints')
@Controller('catalogs/recognition-types')
export class RecognitionTypesController {
  constructor(
    private readonly recognitionTypesCatalogsService: RecognitionTypesService,
  ) {}

  @Get()
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findAll(): Promise<RecognitionTypesDto[]> {
    return this.recognitionTypesCatalogsService.findAll();
  }
}
