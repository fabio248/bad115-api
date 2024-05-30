import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '../dtos/request/create-company.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { CompanyDto } from '../dtos/response/company.dto';
import { roles } from '../../../prisma/seeds/roles.seed';
import { I18nService } from 'nestjs-i18n';
import { UpdateCompanyDto } from '../dtos/request/update-company.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { email, password, countryId, ...createData } = createCompanyDto;

    const company = await this.prismaService.$transaction(async (tPrisma) => {
      const company = await tPrisma.company.create({
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

      await tPrisma.userRole.create({
        data: {
          user: {
            connect: {
              id: company.user.id,
            },
          },
          role: {
            connect: {
              name: roles.COMPANY,
            },
          },
        },
      });

      return company;
    });

    return plainToInstance(CompanyDto, company);
  }

  async findAll(pageDto: PageDto): Promise<PaginatedDto<CompanyDto>> {
    const { skip, take } = getPaginationParams(pageDto);

    const [companies, totalItems] = await Promise.all([
      this.prismaService.company.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
        include: {
          user: true,
          country: true,
        },
      }),
      this.prismaService.company.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: companies.map((company) => plainToInstance(CompanyDto, company)),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }

  async findOne(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: true,
        country: true,
      },
    });

    if (!company) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.COMPANY'),
          },
        }),
      );
    }

    return plainToInstance(CompanyDto, company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    const company = await this.prismaService.company.update({
      where: {
        id,
      },
      data: updateCompanyDto,
    });

    return plainToInstance(CompanyDto, company);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.company.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
