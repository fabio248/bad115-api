import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CompaniesService } from '../services/companies.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from '../dtos/request/create-company.dto';
import { IdDto } from '../../common/dtos/request/id.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { PageDto } from '../../common/dtos/request/page.dto';
import { CompanyDto } from '../dtos/response/company.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { UpdateCompanyDto } from '../dtos/request/update-company.dto';

@ApiTags('Companies Endpoints')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Auth({ permissions: [permissions.READ_COMPANY.codename] })
  @ApiPaginatedResponse(CompanyDto)
  @Get('')
  async findAll(@Query() pageDto: PageDto) {
    return this.companiesService.findAll(pageDto);
  }

  @Post('')
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyDto> {
    return this.companiesService.create(createCompanyDto);
  }

  @Auth({ permissions: [permissions.READ_COMPANY.codename] })
  @Get(':id')
  async findOne(@Param() { id }: IdDto): Promise<CompanyDto> {
    return this.companiesService.findOne(id);
  }

  @Auth({ permissions: [permissions.UPDATE_COMPANY.codename] })
  @Put(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Auth({ permissions: [permissions.DELETE_COMPANY.codename] })
  @Delete(':id')
  async remove(@Param() { id }: IdDto): Promise<void> {
    return this.companiesService.remove(id);
  }
}
