import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressesService } from '../services/addresses.service';
import { MunicipalityIncludeDto } from '../dtos/request/municipality-include.dto';
import { DepartmentIdDto } from '../dtos/request/depatment-id.dto';

@Controller('addresses')
@ApiTags('Address Endpoints')
export class AddressController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get('countries')
  async findCountries() {
    return this.addressesService.findCountries();
  }

  @Get('departments')
  async findDepartments() {
    return this.addressesService.findDepartments();
  }

  @Get('municipalities')
  async findMunicipalities(
    @Query() municipalityIncludeDto: MunicipalityIncludeDto,
  ) {
    return this.addressesService.findMunicipalities(municipalityIncludeDto);
  }

  @Get('departments/:departmentId/municipalities')
  async findMunicipalitiesByDepartment(
    @Param() { departmentId }: DepartmentIdDto,
    @Query() municipalityIncludeDto: MunicipalityIncludeDto,
  ) {
    return this.addressesService.findMunicipalitiesByDepartment(
      departmentId,
      municipalityIncludeDto,
    );
  }
}
