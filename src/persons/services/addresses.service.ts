import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CountryDto } from '../dtos/response/country.dto';
import { DepartmentDto } from '../dtos/response/department.dto';
import { MunicipalityDto } from '../dtos/response/municipality.dto';
import { MunicipalityIncludeDto } from '../dtos/request/municipality-include.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findCountries(): Promise<CountryDto[]> {
    const countries = await this.prismaService.country.findMany({
      orderBy: { name: 'asc' },
    });

    return plainToInstance(CountryDto, countries);
  }

  async findDepartments(): Promise<DepartmentDto[]> {
    const departments = await this.prismaService.department.findMany({
      orderBy: { name: 'asc' },
    });

    return plainToInstance(DepartmentDto, departments);
  }

  async findMunicipalities(
    include?: MunicipalityIncludeDto,
  ): Promise<MunicipalityDto[]> {
    const municipalities = await this.prismaService.municipality.findMany({
      orderBy: { name: 'asc' },
      include,
    });

    return plainToInstance(MunicipalityDto, municipalities);
  }

  async findMunicipalitiesByDepartment(
    departmentId: string,
    include?: MunicipalityIncludeDto,
  ): Promise<MunicipalityDto[]> {
    const municipalities = await this.prismaService.municipality.findMany({
      orderBy: { name: 'asc' },
      where: { departmentId },
      include,
    });

    return plainToInstance(MunicipalityDto, municipalities);
  }
}
