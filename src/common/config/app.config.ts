import { registerAs } from '@nestjs/config';
import { IAppConfig } from './app.interface';

export default registerAs(
  'app',
  (): IAppConfig => ({
    port: process.env.PORT ? +process.env.PORT : 3000,
    databaseUrl: process.env.DATABASE_URL,
  }),
);
