import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { plainToInstance } from 'class-transformer';
import { SocialNetworkTypesDto } from '../dtos/response/social-network-types.dto';

@Injectable()
export class SocialNetworkTypesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const socialNetworkTypes =
      await this.prismaService.typeSocialNetwork.findMany();

    return plainToInstance(SocialNetworkTypesDto, socialNetworkTypes);
  }
}
