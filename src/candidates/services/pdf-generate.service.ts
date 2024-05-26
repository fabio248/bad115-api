import {
  BadRequestException,
  Injectable,
  Logger,
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

@Injectable()
export class PdfGenerateService {
  private readonly logger = new Logger(PdfGenerateService.name);

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
              address: true,
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
        'Content-Disposition': `attachment; filename=CV - ${candidate.person.firstName} ${candidate.person.middleName} ${candidate.person.lastName} ${candidate.person.secondLastName}.pdf`,
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
      fullName: `${candidateInfo.person.firstName} ${
        candidateInfo.person.middleName || ''
      } ${candidateInfo.person.lastName} ${
        candidateInfo.person.secondLastName || ''
      }`.trim(),
      email: candidateInfo.person.user.email, // Asigna el email si está disponible
      phone: candidateInfo.person.user.phone || '',
      address:
        this.formatAddress(candidateInfo.person.address) ||
        'Direccion temporal', // Asigna la dirección si está disponible
      // skills: candidateInfo.technicalSkills.technicalSkill.map(
      //   (skill) => skill.technicalSkills.technicalSkill.name,
      // ),
      technicalSkills: candidateInfo.technicalSkills.map((skill) => ({
        name: skill.technicalSkill.name,
        category: skill.technicalSkill.categoryTechnicalSkill.name,
      })),
      experience: candidateInfo.laboralExperiences.map((exp) => ({
        company: exp.organizationName,
        position: exp.name,
        startDate: new Date(exp.initDate).toLocaleDateString(),
        endDate: exp.currentJob
          ? 'Present'
          : new Date(exp.finishDate).toLocaleDateString(),
        description: exp.functionPerformed,
      })),
      education: candidateInfo.academicKnowledges.map((edu) => ({
        institution: edu.organizationName,
        degree: edu.type,
        startDate: new Date(edu.initDate).toLocaleDateString(),
        endDate: new Date(edu.finishDate).toLocaleDateString(),
        description: edu.name,
      })),
      certifications: candidateInfo.certifications.map((cer) => ({
        nombreCertification: cer.name,
        type: cer.type,
        startDate: new Date(cer.initDate).toLocaleDateString(),
        endDate: new Date(cer.finishDate).toLocaleDateString(),
        nombreDeLaOrganizacion: cer.organizationName,
      })),

      recognitions: candidateInfo.certifications.map((re) => ({
        nombreCertification: re.name,
        endDate: new Date(re.finishDate).toLocaleDateString(),
      })),
      languageSkills: candidateInfo.languageSkills.map((langSkill) => ({
        language: langSkill.skill,
        level: langSkill.level,
      })),
      participations: candidateInfo.participations.map((parti) => ({
        Lugar: parti.place,
        ciudad: parti.country,
        LugarDelEvento: parti.eventHost,
      })),
    };
  }

  private formatAddress(address: any): string {
    if (!address) return '';
    const { street, city, state, postalCode, country } = address;
    return `${street || ''}, ${city || ''}, ${state || ''}, ${
      postalCode || ''
    }, ${country || ''}`.trim();
  }
}
