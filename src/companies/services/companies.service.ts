import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from '../dtos/request/create-company.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CompanyDto } from '../dtos/response/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { email, password, countryId, ...createData } = createCompanyDto;
    const company = await this.prismaService.company.create({
      data: {
        ...createData,
        user: {
          create: {
            email,
            password,
          },
        },
        country: {
          connect: {
            id: countryId,
          },
        },
      },
      include: {
        user: true,
        country: true,
      },
    });

    return plainToInstance(CompanyDto, company);
  }
}
