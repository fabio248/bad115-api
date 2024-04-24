import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { CreateCertificationDto } from '../dto/request/create-certification.dto';
import { CertificationDto } from '../dto/response/certification.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCertificationDto } from '../dto/request/update-certification.dto';

@Injectable()
export class CertificationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create({
    candidateId,
    createCertificationDto,
  }: {
    candidateId: string;
    createCertificationDto: CreateCertificationDto;
  }): Promise<CertificationDto> {
    const candidate = await this.prismaService.candidate.findUnique({
      where: {
        id: candidateId,
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

    const certification = this.prismaService.certification.create({
      data: {
        ...createCertificationDto,
        candidate: {
          connect: {
            id: candidateId,
          },
        },
      },
    });

    return plainToInstance(CertificationDto, certification);
  }

  async find(candidateId: string): Promise<CertificationDto[]> {
    const certifications = await this.prismaService.certification.findMany({
      where: {
        candidateId,
        deletedAt: null,
      },
    });

    return plainToInstance(CertificationDto, certifications);
  }

  async findOne(
    candidateId: string,
    certificationId: string,
  ): Promise<CertificationDto> {
    const certification = await this.prismaService.certification.findUnique({
      where: {
        candidateId,
        id: certificationId,
        deletedAt: null,
      },
    });

    if (!certification) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND.DEFAULT', {
          args: {
            entity: this.i18n.t('entities.CERTIFICATION'),
          },
        }),
      );
    }

    return plainToInstance(CertificationDto, certification);
  }

  async update(
    candidateId: string,
    certificationId: string,
    updateCertificationDto: UpdateCertificationDto,
  ): Promise<CertificationDto> {
    await this.findOne(candidateId, certificationId);

    const updatedCertification = this.prismaService.certification.update({
      where: {
        candidateId,
        id: certificationId,
      },
      data: updateCertificationDto,
    });

    return plainToInstance(CertificationDto, updatedCertification);
  }

  async delete(candidateId: string, certificationId: string): Promise<void> {
    await this.findOne(candidateId, certificationId);

    await this.prismaService.certification.update({
      where: {
        candidateId,
        id: certificationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
