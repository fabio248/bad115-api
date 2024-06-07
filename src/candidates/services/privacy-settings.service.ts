import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrivacySettingsDto } from '../dto/request/create-privacy-settings.dto';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PrivacySettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async update(
    id: string,
    createPrivacySettingsDto: CreatePrivacySettingsDto,
  ): Promise<void> {
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: id,
      },
      include: {
        ...createPrivacySettingsDto,
      },
    });

    if (!candidate) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CANDIDATE'),
          },
        }),
      );
    }
    // switch (){

    // }
  }
}
