import { Body, Controller, Post } from '@nestjs/common';
import { CompaniesService } from '../services/companies.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from '../dtos/request/create-company.dto';

@ApiTags('Companies Endpoints')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('')
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }
}
