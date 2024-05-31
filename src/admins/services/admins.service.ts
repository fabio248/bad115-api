import { Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateUnlockRequestDto } from '../dtos/request/update-unlock-request.dto';
import { I18nService } from 'nestjs-i18n';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SEND_EMAIL_EVENT } from '../../common/events/mail.event';
import { ConfigService } from '@nestjs/config';
import { MailRejectUnblockUserTemplateData } from '../../common/types/mail.types';

@Injectable()
export class AdminsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

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

  async findOneUnlockRequest(id: string) {
    const unlockRequest = await this.prismaService.unlockRequest.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            person: true,
          },
        },
      },
    });

    if (!unlockRequest) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.UNLOCK_REQUEST'),
          },
        }),
      );
    }

    return plainToInstance(UnlockRequestDto, unlockRequest);
  }

  async updateUnlockRequest(
    id: string,
    updateUnlockRequestDto: UpdateUnlockRequestDto,
  ) {
    await this.findOneUnlockRequest(id);

    const unlockRequest = await this.prismaService.unlockRequest.update({
      where: {
        id,
      },
      data: updateUnlockRequestDto,
      include: {
        user: {
          include: {
            person: true,
          },
        },
      },
    });

    switch (updateUnlockRequestDto.status) {
      case 'REJECTED':
        const mailBody: MailRejectUnblockUserTemplateData = {
          dynamicTemplateData: {
            userName: `${unlockRequest.user.person.firstName} ${unlockRequest.user.person.lastName}`,
            reason: updateUnlockRequestDto.reason,
          },
          to: unlockRequest.user.email,
          from: this.configService.get('app.sendgrid.email'),
          templateId: this.configService.get(
            'app.sendgrid.templates.rejectUnblock',
          ),
        };

        await Promise.all([
          this.eventEmitter.emit(SEND_EMAIL_EVENT, mailBody),
          this.prismaService.user.update({
            where: {
              id: unlockRequest.userId,
            },
            data: {
              isActive: false,
            },
          }),
        ]);
        break;
      case 'APPROVED':
        await Promise.all([
          this.eventEmitter.emit(SEND_EMAIL_EVENT, {
            to: unlockRequest.user.email,
            from: this.configService.get('app.sendgrid.email'),
            templateId: this.configService.get(
              'app.sendgrid.templates.approveUnblock',
            ),
          }),
          this.prismaService.user.update({
            where: {
              id: unlockRequest.userId,
            },
            data: {
              isActive: true,
              loginAttemps: 0,
            },
          }),
        ]);

        break;
      default:
        break;
    }

    return plainToInstance(UnlockRequestDto, unlockRequest);
  }
}
