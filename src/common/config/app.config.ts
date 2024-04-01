import { registerAs } from '@nestjs/config';
import { IAppConfig } from './app.interface';

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
      },
    },
  }),
);
