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
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      email: process.env.SENDGRID_FROM_EMAIL,
      templates: {
        welcome: process.env.SENDGRID_WELCOME_MAIL_TEMPLATE_ID,
      },
    },
  }),
);
