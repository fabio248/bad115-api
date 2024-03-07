import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaConfigService } from './common/services/prisma-config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { appValidator } from './common/config/app.validator';
import appConfig from './common/config/app.config';
import * as path from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      expandVariables: true,
      isGlobal: true,
      validationSchema: appValidator,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: path.join(__dirname, 'common/i18n'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
      viewEngine: 'pug',
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AuthModule, UsersModule],
})
export class AppModule {}
