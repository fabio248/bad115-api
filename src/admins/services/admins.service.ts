import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PageDto } from '../../common/dtos/request/page.dto';
import {
  getPaginationInfo,
  getPaginationParams,
} from '../../common/utils/pagination.utils';
import { UnlockRequestFilterDto } from '../dtos/request/unlock-request-filter.dto';
import { getSortObject } from '../../common/utils/sort.utils';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UnlockRequestDto } from '../dtos/response/unlock-request.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUnlockRequests(
    pageDto: PageDto,
    { sort, status }: UnlockRequestFilterDto,
  ) {
    const { skip, take } = getPaginationParams(pageDto);
    const whereInput: Prisma.UnlockRequestWhereInput = {
      deletedAt: null,
    };

    if (Array.isArray(status) && status.length > 0) {
      whereInput.status = {
        in: status,
      };
    }

    const [unlockRequests, totalItems] = await Promise.all([
      this.prismaService.unlockRequest.findMany({
        where: whereInput,
        include: {
          user: {
            include: {
              person: true,
            },
          },
        },
        skip,
        take,
        orderBy: getSortObject(sort),
      }),
      this.prismaService.unlockRequest.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: plainToInstance(UnlockRequestDto, unlockRequests),
      pagination: getPaginationInfo(pageDto, totalItems),
    };
  }
}
