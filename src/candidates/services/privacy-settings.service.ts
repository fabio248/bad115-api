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
        person: true,
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
    const updates = {};
    for (const [key, value] of Object.entries(createPrivacySettingsDto)) {
      switch (key) {
        case 'laboralExperiences':
          updates['laboralExperiences'] = value;
          break;
        case 'academicKnowledges':
          updates['academicKnowledges'] = value;
          break;
        case 'certifications':
          updates['certifications'] = value;
          break;
        case 'technicalSkills':
          updates['technicalSkills'] = value;
          break;
        case 'languageSkills':
          updates['languageSkills'] = value;
          break;
        case 'recognitions':
          updates['recognitions'] = value;
          break;
        case 'publications':
          updates['publications'] = value;
          break;
        case 'participations':
          updates['participations'] = value;
          break;
        case 'tests':
          updates['tests'] = value;
          break;
        case 'recomendations':
          updates['recomendations'] = value;
          break;
        case 'address':
          updates['address'] = value;
          break;
        case 'documents':
          updates['documents'] = value;
          break;
        case 'socialNetwork':
          updates['socialNetwork'] = value;
          break;
        default:
          break;
      }
    }
    await this.prismaService.privacySettings.update({
      where: {
        id: candidate.person.privacySettingsId,
      },
      data: { ...updates },
    });
  }
}
