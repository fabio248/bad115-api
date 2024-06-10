import { Injectable, Logger } from '@nestjs/common';
import { MailsService } from '../services/mails.service';
import { OnEvent } from '@nestjs/event-emitter';
import { JobPositionService } from '../../job-position/services/job-position.service';
import { RecommendedJobPositionTemplateData } from '../types/mail.types';
import { ConfigService } from '@nestjs/config';

export const RECOMMENDED_JOB_POSITION = Symbol('RECOMMENDED_JOB_POSITION');

@Injectable()
export class MailsEvent {
  constructor(
    private readonly mailsService: MailsService,
    private readonly jobPositionService: JobPositionService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(RECOMMENDED_JOB_POSITION)
  async handleSendEmailRecommendedJobPosition(
    jobPositionId: string,
  ): Promise<void> {
    try {
      const [matchedCandidates, jobPosition] = await Promise.all([
        this.jobPositionService.calculatePercentageMatchCandidateJobPosition(
          jobPositionId,
        ),
        this.jobPositionService.findOne(jobPositionId),
      ]);

      if (matchedCandidates.length === 0) {
        return;
      }

      const sendEmailsCandidate = matchedCandidates.filter(
        (info) => info.percentage >= 0.5,
      );

      await Promise.all(
        sendEmailsCandidate.map(({ candidate }) => {
          const mailBody: RecommendedJobPositionTemplateData = {
            to: candidate.person.user.email,
            templateId: this.configService.get(
              'app.sendgrid.templates.recommendedJobPosition',
            ),
            from: this.configService.get('app.sendgrid.from'),
            dynamicTemplateData: {
              userName: `${candidate.person.firstName} ${candidate.person.lastName}`,
              companyName: jobPosition.company.name,
              positionName: jobPosition.name,
              positionLink: `${this.configService.get(
                'app.urls.front',
              )}/login?redirect=/job-position/${jobPositionId}`,
            },
          };
          return this.mailsService.sendMail(mailBody);
        }),
      );
    } catch (err) {
      Logger.error(err);
    }
  }
}
