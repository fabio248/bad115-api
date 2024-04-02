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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PersonsModule } from './persons/persons.module';
import { AdminsModule } from './admins/admins.module';
import { RolesModule } from './roles/roles.module';
import { CandidateModule } from './candidate/candidate.module';

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
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
      viewEngine: 'pug',
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 5,
      verboseMemoryLeak: true,
      ignoreErrors: false,
      global: true,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    PersonsModule,
    AdminsModule,
    RolesModule,
    CandidateModule,
  ],
  controllers: [AppController],
  providers: [AuthModule, UsersModule],
})
export class AppModule {}
