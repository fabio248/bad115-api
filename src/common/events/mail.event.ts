import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailsService } from '../services/mails.service';
import sendgrid from '@sendgrid/mail';

export const SEND_EMAIL_EVENT = Symbol('SEND_EMAIL_EVENT');

@Injectable()
export class MailsEvent {
  constructor(private readonly mailsService: MailsService) {}

  @OnEvent(SEND_EMAIL_EVENT)
  async handleSendEmailEvent(msg: sendgrid.MailDataRequired): Promise<void> {
    try {
      await this.mailsService.sendMail(msg);
    } catch (err) {
      Logger.error(err);
    }
  }
}
