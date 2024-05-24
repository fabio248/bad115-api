import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePersonDto } from '../dtos/request/create-person.dto';
import { UpdatePersonDto } from '../dtos/request/update-person.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { PersonDto } from '../dtos/response/person.dto';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { I18nService } from 'nestjs-i18n';
import { CreateAddressDto } from '../dtos/request/create-address.dto';
import { AddressDto } from '../dtos/response/address.dto';
import { EL_SALVADOR } from '../../common/utils/constants';
import { Prisma } from '@prisma/client';
import { UpsertDocumentDto } from '../dtos/request/upsert-document.dto';
import { DocumentDto } from '../dtos/response/document.dto';

@Injectable()
export class PersonsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  create(createPersonDto: CreatePersonDto) {
    const person = this.prismaService.person.create({
      data: {
        ...createPersonDto,
        user: { connect: { id: 'userId' } },
      },
    });
    return plainToInstance(PersonDto, person);
  }

  async findAll(
    pageDto: PageDto,
    include?: Prisma.PersonInclude,
  ): Promise<PaginatedDto<PersonDto>> {
    const { skip, take } = getPaginationParams(pageDto);
    const { address } = include || {};

    const [persons, totalItems] = await Promise.all([
      this.prismaService.person.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
        },
        include: {
          ...include,
          ...(address
            ? {
                address: {
                  include: {
                    country: true,
                    department: true,
                    municipality: true,
                  },
                },
              }
            : { address: false }),
        },
      }),
      this.prismaService.person.count({
        skip,
        take,
      }),
    ]);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return { data: plainToInstance(PersonDto, persons), pagination };
  }

  async findOne(
    id: string,
    include?: Prisma.PersonInclude,
  ): Promise<PersonDto> {
    const { address } = include || {};

    const person = await this.prismaService.person.findUnique({
      where: {
        id,
      },
      include: {
        ...include,
        ...(address
          ? {
              address: {
                include: {
                  country: true,
                  department: true,
                  municipality: true,
                },
              },
            }
          : { address: false }),
      },
    });

    if (!person) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.PERSON'),
          },
        }),
      );
    }

    return plainToInstance(PersonDto, person);
  }

  async update(
    id: string,
    updatePersonDto: UpdatePersonDto,
  ): Promise<PersonDto> {
    await this.findOne(id);

    const updatedPerson = await this.prismaService.person.update({
      where: {
        id,
      },
      data: updatePersonDto,
    });

    return plainToInstance(PersonDto, updatedPerson);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.person.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async addAddress(
    personId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    let address;

    const { countryId, municipalityId, departmentId } = createAddressDto;

    const [country, person, department, municipality] = await Promise.all([
      this.prismaService.country.findUnique({ where: { id: countryId } }),
      await this.findOne(personId, { address: { include: { country: true } } }),
      this.prismaService.department.findUnique({ where: { id: departmentId } }),
      this.prismaService.municipality.findFirst({
        where: { id: municipalityId, departmentId },
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

    if (departmentId && !department) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.DEPARTMENT'),
          },
        }),
      );
    }

    if (municipalityId && !municipality) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.MUNICIPALITY'),
          },
        }),
      );
    }

    if (person.address) {
      throw new UnprocessableEntityException('Person already has an address');
    }

    if (country.name === EL_SALVADOR) {
      address = this.prismaService.address.create({
        data: {
          street: createAddressDto.street,
          numberHouse: createAddressDto.numberHouse,
          country: { connect: { id: countryId } },
          department: { connect: { id: departmentId } },
          municipality: { connect: { id: municipalityId } },
          person: { connect: { id: personId } },
        },
      });
    } else {
      address = this.prismaService.address.create({
        data: {
          street: createAddressDto.street,
          numberHouse: createAddressDto.numberHouse,
          country: { connect: { id: countryId } },
          person: { connect: { id: personId } },
        },
      });
    }

    return plainToInstance(AddressDto, address);
  }

  async upsertDocument(
    personId: string,
    upsertDocumentDto: UpsertDocumentDto,
  ): Promise<DocumentDto> {
    const document = await this.prismaService.document.upsert({
      where: {
        id: upsertDocumentDto?.id ?? ' ',
      },
      create: {
        ...upsertDocumentDto,
        person: { connect: { id: personId } },
      },
      update: {
        id: upsertDocumentDto.id,
        number: upsertDocumentDto.number,
      },
    });

    return plainToInstance(DocumentDto, document);
  }
}
