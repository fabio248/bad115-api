import sendgrid from '@sendgrid/mail';

export type MailUnblockUserTemplateData = {
  dynamicTemplateData: {
    userName: string;
    userEmail: string;
    userId: string;
  };
} & sendgrid.MailDataRequired;

export type MailRejectUnblockUserTemplateData = {
  dynamicTemplateData: {
    userName: string;
    reason: string;
  };
} & sendgrid.MailDataRequired;

export type MailAlertMeetingTemplateData = {
  dynamicTemplateData: {
    userName: string;
    date: Date;
    positionName: string;
    link: string;
  };
} & sendgrid.MailDataRequired;
