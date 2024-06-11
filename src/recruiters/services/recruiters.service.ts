import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CompanyDto } from '../../companies/dtos/response/company.dto';

@Injectable()
export class RecruitersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecruitersCompany(recruiterId: string) {
    const companies = await this.prismaService.companyRecruiter.findMany({
      where: {
        recruiterId,
      },
      include: {
        company: true,
      },
    });

    return plainToInstance(
      CompanyDto,
      companies.map((company) => company.company),
    );
  }
}
