import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';

@Injectable()
export class MailsService {
  constructor(private readonly configService: ConfigService) {
    sendgrid.setApiKey(this.configService.get('app.sendgrid.apiKey'));
  }

  async sendMail(msg: sendgrid.MailDataRequired): Promise<void> {
    try {
      await sendgrid.send(msg);

      Logger.debug('Email successfully sent');
    } catch (error) {
      Logger.error(error);
    }
  }
}
