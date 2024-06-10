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
    date: string;
    positionName: string;
    link: string;
  };
} & sendgrid.MailDataRequired;

export type MailAlertJobPositionRecruiterTemplateData = {
  dynamicTemplateData: {
    recruiterName: string;
    positionName: string;
    candidateName: string;
    candidateEmail: string;
  };
} & sendgrid.MailDataRequired;

export type MailAlertJobPositionCandidateTemplateData = {
  dynamicTemplateData: {
    userName: string;
    positionName: string;
    companyName: string;
  };
} & sendgrid.MailDataRequired;

export type RecommendedJobPositionTemplateData = {
  dynamicTemplateData: {
    userName: string;
    positionName: string;
    companyName: string;
    addressPosition: string;
    positionLink: string;
  };
} & sendgrid.MailDataRequired;
