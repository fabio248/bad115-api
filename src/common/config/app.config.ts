import { registerAs } from '@nestjs/config';
import { IAppConfig } from './app.interface';
import * as process from 'node:process';

export default registerAs(
  'app',
  (): IAppConfig => ({
    port: process.env.PORT ? +process.env.PORT : 3000,
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      expiresInRefresh: process.env.JWT_EXPIRES_IN_REFRESH,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      email: process.env.SENDGRID_FROM_EMAIL,
      templates: {
        welcome: process.env.SENDGRID_WELCOME_MAIL_TEMPLATE_ID,
        unblock: process.env.SENDGRID_UNBLOCK_USER_MAIL_TEMPLATE_ID,
        rejectUnblock:
          process.env.SENDGRID_REJECT_REQUEST_UNBLOCK_USER_MAIL_TEMPLATE_ID,
        approveUnblock:
          process.env.SENDFRID_APPROVED_REQUEST_UNBLOCK_USER_MAIL_TEMPLATE_ID,
      },
    },
    aws: {
      region: process.env.AWS_REGION,
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
    },
  }),
);
