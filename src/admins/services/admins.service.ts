import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService: PrismaService) {}
}
