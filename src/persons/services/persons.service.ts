import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from '../dtos/request/create-person.dto';
import { UpdatePersonDto } from '../dtos/request/update-person.dto';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { PersonDto } from '../dtos/response/person.dto';

@Injectable()
export class PersonsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPersonDto: CreatePersonDto) {
    const person = this.prismaService.person.create({
      data: {
        ...createPersonDto,
        user: { connect: { id: 'userId' } },
      },
    });
    return plainToInstance(PersonDto, person);
  }

  findAll() {
    return `This action returns all persons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    updatePersonDto;
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
