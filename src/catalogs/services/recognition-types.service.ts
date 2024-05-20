import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecognitionTypesDto } from '../dtos/response/recognition-types.dto';

@Injectable()
export class RecognitionTypesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const recognitionTypes =
      await this.prismaService.recognitionType.findMany();

    return plainToInstance(RecognitionTypesDto, recognitionTypes);
  }
}
