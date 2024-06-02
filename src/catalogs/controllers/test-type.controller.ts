import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TestTypeService } from '../services/test-type.service';
import { TestTypeDto } from '../dtos/response/test-type.dto';
import { CreateTestTypeDto } from '../dtos/request/create-test-type.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { permissions } from 'prisma/seeds/permissions.seed';
import { TestTypeIdDto } from '../dtos/request/create-test-type-id.dto';
import { UpdateTestTypeDto } from '../dtos/request/update-test-type.dto';

@Controller('catalogs/test-type')
@ApiTags('Test Types Endpoints')
export class TestTypeController {
  constructor(private readonly testTypeService: TestTypeService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new test type' })
  // @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  create(@Body() createTestTypeDto: CreateTestTypeDto): Promise<TestTypeDto> {
    return this.testTypeService.create(createTestTypeDto);
  }
  @Get('/:testTypeId')
  @ApiOperation({ summary: 'Find one a test type' })
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findOne(@Param() { testTypeId }: TestTypeIdDto): Promise<TestTypeDto> {
    return this.testTypeService.findOne(testTypeId);
  }

  @Get('')
  @ApiOperation({ summary: 'Find All test type' })
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  async findAll(): Promise<TestTypeDto[]> {
    return this.testTypeService.findAll();
  }

  @Put('/:testTypeId')
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  async update(
    @Param() { testTypeId }: TestTypeIdDto,
    @Body() updateTestTypeDto: UpdateTestTypeDto,
  ): Promise<TestTypeDto> {
    return this.testTypeService.update(testTypeId, updateTestTypeDto);
  }

  @Delete('/:testTypeId')
  //   @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  async remove(@Param() { testTypeId }: TestTypeIdDto) {
    return this.testTypeService.remove(testTypeId);
  }
}
