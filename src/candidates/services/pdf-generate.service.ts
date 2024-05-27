import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { CvDataTemplate } from '../interfaces';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { AddressDto } from '../../persons/dtos/response/address.dto';

@Injectable()
export class PdfGenerateService {
  constructor(
    private readonly i18n: I18nService,
    private readonly prismaService: PrismaService,
  ) {}

  async generate(res: Response, id: string): Promise<void> {
    try {
      const candidate = await this.prismaService.candidate.findUnique({
        where: { id },
        include: {
          academicKnowledges: true,
          laboralExperiences: true,
          person: {
            include: {
              user: true,
              address: {
                include: {
                  country: true,
                  department: true,
                  municipality: true,
                },
              },
              socialNetwork: true,
            },
          },
          certifications: true,
          recognitions: true,
          languageSkills: {
            include: {
              language: true,
            },
          },
          participations: true,
          recomendations: true,
          technicalSkills: {
            include: {
              technicalSkill: {
                include: {
                  categoryTechnicalSkill: true,
                },
              },
            },
          },
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

      // Mapping the candidateInfo to CvDataTemplate
      const cvData: CvDataTemplate =
        this.mapCandidateInfoToCvDataTemplate(candidate);

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compileCv(cvData);

      await page.setContent(content);
      await page.emulateMediaType('screen');

      const buffer = await page.pdf({
        format: 'A4',
        // margin: { top: 20, left: 20, bottom: 20, right: 20 },
        printBackground: true,
      });

      await browser.close();

      // Cambiamos el formato del buffer a un formato pdf
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=CV - ${candidate.person?.firstName} ${candidate.person?.middleName} ${candidate.person?.lastName} ${candidate.person?.secondLastName}.pdf`,
        'Content-Length': buffer.length,
      });
      // Retornamos el buffer
      res.end(buffer);
    } catch (error) {
      throw new BadRequestException(
        this.i18n.t('exception.BAD_REQUEST.PDF_ERROR', {
          args: error.message,
        }),
      );
    }
  }

  async compileCv(data: CvDataTemplate) {
    const templatePath = path.resolve(
      __dirname,
      `../templates/template-cv.hbs`,
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateHtml);

    return template(data);
  }

  private mapCandidateInfoToCvDataTemplate(candidateInfo: any): CvDataTemplate {
    return {
      profilePicture: '',
      fullName: `${candidateInfo.person?.firstName ?? 'Nombre no disponible'} ${
        candidateInfo.person?.middleName ?? ''
      } ${candidateInfo.person?.lastName ?? 'Apellido no disponible'} ${
        candidateInfo.person?.secondLastName ?? ''
      }`.trim(),
      email: candidateInfo.person?.user?.email ?? 'Email no disponible',
      phone: candidateInfo.person?.user?.phone ?? 'Teléfono no disponible',
      address:
        this.formatAddress(candidateInfo.person?.address) ||
        'No posee dirección registrada',
      technicalSkills: candidateInfo.technicalSkills?.map((skill) => ({
        name: skill.technicalSkill?.name ?? 'Habilidad técnica no disponible',
        category:
          skill.technicalSkill?.categoryTechnicalSkill?.name ??
          'Categoría no disponible',
      })) ?? [
        {
          name: 'Habilidad técnica no disponible',
          category: 'Categoría no disponible',
        },
      ],
      experience: candidateInfo.laboralExperiences?.map((exp) => ({
        company: exp.organizationName ?? 'Empresa no disponible',
        position: exp.name ?? 'Posición no disponible',
        startDate: exp.initDate
          ? new Date(exp.initDate).toLocaleDateString()
          : 'Fecha de inicio no disponible',
        endDate: exp.currentJob
          ? 'Presente'
          : exp.finishDate
          ? new Date(exp.finishDate).toLocaleDateString()
          : 'Fecha de fin no disponible',
        description: exp.functionPerformed ?? 'Descripción no disponible',
      })) ?? [
        {
          company: 'Empresa no disponible',
          position: 'Posición no disponible',
          startDate: 'Fecha de inicio no disponible',
          endDate: 'Fecha de fin no disponible',
          description: 'Descripción no disponible',
        },
      ],
      education: candidateInfo.academicKnowledges?.map((edu) => ({
        institution: edu.organizationName ?? 'Institución no disponible',
        degree: edu.type ?? 'Título no disponible',
        startDate: edu.initDate
          ? new Date(edu.initDate).toLocaleDateString()
          : 'Fecha de inicio no disponible',
        endDate: edu.finishDate
          ? new Date(edu.finishDate).toLocaleDateString()
          : 'Fecha de fin no disponible',
        description: edu.name ?? 'Descripción no disponible',
      })) ?? [
        {
          institution: 'Institución no disponible',
          degree: 'Título no disponible',
          startDate: 'Fecha de inicio no disponible',
          endDate: 'Fecha de fin no disponible',
          description: 'Descripción no disponible',
        },
      ],
      certifications: candidateInfo.certifications?.map((cer) => ({
        nombreCertification: cer.name ?? 'Certificación no disponible',
        type: cer.type ?? 'Tipo no disponible',
        startDate: cer.initDate
          ? new Date(cer.initDate).toLocaleDateString()
          : 'Fecha de inicio no disponible',
        endDate: cer.finishDate
          ? new Date(cer.finishDate).toLocaleDateString()
          : 'Fecha de fin no disponible',
        nombreDeLaOrganizacion:
          cer.organizationName ?? 'Organización no disponible',
      })) ?? [
        {
          nombreCertification: 'Certificación no disponible',
          type: 'Tipo no disponible',
          startDate: 'Fecha de inicio no disponible',
          endDate: 'Fecha de fin no disponible',
          nombreDeLaOrganizacion: 'Organización no disponible',
        },
      ],
      recognitions: candidateInfo.certifications?.map((re) => ({
        nombreCertification: re.name ?? 'Reconocimiento no disponible',
        endDate: re.finishDate
          ? new Date(re.finishDate).toLocaleDateString()
          : 'Fecha de fin no disponible',
      })) ?? [
        {
          nombreCertification: 'Reconocimiento no disponible',
          endDate: 'Fecha de fin no disponible',
        },
      ],
      languageSkills: candidateInfo.languageSkills?.map((langSkill) => ({
        language: langSkill.skill ?? 'Idioma no disponible',
        level: langSkill.level ?? 'Nivel no disponible',
      })) ?? [
        { language: 'Idioma no disponible', level: 'Nivel no disponible' },
      ],
      participations: candidateInfo.participations?.map((parti) => ({
        Lugar: parti.place ?? 'Lugar no disponible',
        ciudad: parti.country ?? 'Ciudad no disponible',
        LugarDelEvento: parti.eventHost ?? 'Lugar del evento no disponible',
      })) ?? [
        {
          Lugar: 'Lugar no disponible',
          ciudad: 'Ciudad no disponible',
          LugarDelEvento: 'Lugar del evento no disponible',
        },
      ],
    };
  }

  private formatAddress(address: AddressDto): string {
    if (!address) return '';

    const { street, country, department, municipality, numberHouse } = address;

    if (country.name === 'El Salvador') {
      return `${street ?? ''}, ${numberHouse ?? ''}, ${
        municipality?.name ?? ''
      }, ${department?.name ?? ''}, ${country.name}`.trim();
    }

    return `${street}, ${numberHouse}, ${country.name}`.trim();
  }
}
