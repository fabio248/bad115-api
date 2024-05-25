import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { CvDataTemplate } from '../interfaces';

@Injectable()
export class PdfsService {
  private readonly logger = new Logger(PdfsService.name);

  constructor() {}

  async generate(data: CvDataTemplate): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compileCv(data);

      await page.setContent(content);
      await page.emulateMediaType('screen');

      const buffer = await page.pdf({
        format: 'A4',
        margin: { top: 20, left: 20, bottom: 20, right: 20 },
        printBackground: true,
      });

      await browser.close();

      return buffer;
    } catch (error) {
      this.logger.error(error);
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
}
