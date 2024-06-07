import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CountryDto } from '../dtos/response/country.dto';
import { DepartmentDto } from '../dtos/response/department.dto';
import { MunicipalityDto } from '../dtos/response/municipality.dto';
import { MunicipalityIncludeDto } from '../dtos/request/municipality-include.dto';
import { UpdateAddressDto } from '../../job-position/dtos/request/update-address.dto';
import { EL_SALVADOR } from '../../common/utils/constants';
import { I18nService } from 'nestjs-i18n';
import { AddressDto } from '../dtos/response/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

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

  async findOne(id: string) {
    const address = await this.prismaService.address.findUnique({
      where: {
        id,
      },
      include: {
        country: true,
        department: true,
        municipality: true,
      },
    });

    if (!address) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.ADDRESS'),
          },
        }),
      );
    }

    return plainToInstance(AddressDto, address);
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);

    const { countryId, departmentId, municipalityId, ...updateData } =
      updateAddressDto;

    const [country, department, municipality] = await Promise.all([
      this.prismaService.country.findUnique({
        where: {
          id: countryId,
        },
      }),
      this.prismaService.department.findUnique({
        where: {
          id: departmentId,
        },
      }),
      this.prismaService.municipality.findFirst({
        where: {
          id: municipalityId,
          departmentId: departmentId ? departmentId : address?.department?.id,
        },
      }),
    ]);

    if (!country) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.COUNTRY'),
          },
        }),
      );
    }

    if (!department) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.DEPARTMENT'),
          },
        }),
      );
    }

    if (!municipality) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.MUNICIPALITY'),
      );
    }

    if (country.name === EL_SALVADOR) {
      await this.prismaService.address.update({
        where: {
          id,
        },
        data: {
          ...updateData,
          country: countryId ? { connect: { id: countryId } } : undefined,
          department: departmentId
            ? { connect: { id: departmentId } }
            : undefined,
          municipality: municipalityId
            ? { connect: { id: municipalityId } }
            : undefined,
        },
      });
    } else {
      await this.prismaService.address.update({
        where: {
          id,
        },
        data: {
          ...updateData,
          country: countryId ? { connect: { id: countryId } } : undefined,
          department: {
            disconnect: true,
          },
          municipality: {
            disconnect: true,
          },
        },
      });
    }
  }
}
