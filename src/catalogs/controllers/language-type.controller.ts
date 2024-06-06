import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LanguageTypeService } from '../services/language-type.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

//Dto's
import { CreateLanguageTypesDto } from '../dtos/request/create-language-type.dto';
import { LanguageTypesDto } from '../dtos/response/language-type.dto';
import { LanguageTypeIdDto } from '../dtos/request/create-language-types-id.dto';
import { UpdateLanguageTypeDto } from '../dtos/request/update-language-type.dto';

@Controller('catalogs/language-type')
@ApiTags('Language Types Endpoints')
export class LanguageTypeController {
  constructor(private readonly languageTypeService: LanguageTypeService) {}

  @Post('')
  @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  create(
    @Body() createLanguageTypesDto: CreateLanguageTypesDto,
  ): Promise<LanguageTypesDto> {
    return this.languageTypeService.create(createLanguageTypesDto);
  }

  @Get('/:languageTypeId')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findOne(
    @Param() { languageTypeId }: LanguageTypeIdDto,
  ): Promise<LanguageTypesDto> {
    return this.languageTypeService.findOne(languageTypeId);
  }

  @Get('')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findAll(): Promise<LanguageTypesDto[]> {
    return this.languageTypeService.findAll();
  }

  @Put('/:languageTypeId')
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  async update(
    @Param() { languageTypeId }: LanguageTypeIdDto,
    @Body() updateLanguageTypeDto: UpdateLanguageTypeDto,
  ): Promise<LanguageTypesDto> {
    return this.languageTypeService.update(
      languageTypeId,
      updateLanguageTypeDto,
    );
  }

  @Delete('/:languageTypeId')
  @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  async remove(@Param() { languageTypeId }: LanguageTypeIdDto) {
    return this.languageTypeService.remove(languageTypeId);
  }
}
