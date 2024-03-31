import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(pageDto: PageDto): Promise<PaginatedDto<PersonDto>> {
    const { skip, take } = getPaginationParams(pageDto);

    const [persons, totalItems] = await Promise.all([
      this.prismaService.person.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
        },
        include: {
          user: true,
        },
      }),
      this.prismaService.person.count({
        skip,
        take,
      }),
    ]);

    console.log('persons', persons);

    const pagination = getPaginationInfo(pageDto, totalItems);

    return { data: plainToInstance(PersonDto, persons), pagination };
  }

  async findOne(id: string): Promise<PersonDto> {
    const person = await this.prismaService.person.findUnique({
      where: {
        id,
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
}
