import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { ParticipationTypesDto } from '../dtos/response/participation-types.dto';

@Injectable()
export class ParticipationTypesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const participationTypes =
      await this.prismaService.participacionType.findMany();

    return plainToInstance(ParticipationTypesDto, participationTypes);
  }
}
