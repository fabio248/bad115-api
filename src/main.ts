import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { i18nValidationErrorFactory } from 'nestjs-i18n';

//import elements to render information of cronJob
import { PrismaClient } from '@prisma/client';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { FormattedDate } from './recruiters/utils/formatted-date.utils';

async function restoreCronJobs(
  prisma: PrismaClient,
  schedulerRegistry: SchedulerRegistry,
) {
  const getHour = new Date();

  const pendingCronJobs = await prisma.alerts.findMany({
    where: {
      dateCronJob: {
        gte: getHour,
      },
      deletedAt: null,
    },
    include: {
      meeting: true,
    },
  });

  pendingCronJobs.forEach((cronJob) => {
    const resultFormattedDate = FormattedDate(cronJob.meeting.executionDate);
    const job = new CronJob(`${resultFormattedDate}`, async () => {
      this.logger.warn(
        `time ${cronJob.dateCronJob} for job ${cronJob.name} to run!`,
      );

      await this.SendScheduledEmail(cronJob.meeting.jobAplicationId, {
        link: cronJob.meeting.link,
        executionDate: cronJob.dateCronJob,
      });
    });

    schedulerRegistry.addCronJob(cronJob.name, job);
    job.start();
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('BAD115 API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);

  const prisma = new PrismaClient();
  const schedulerRegistry = new SchedulerRegistry();

  await restoreCronJobs(prisma, schedulerRegistry);

  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Listening on port: ${port}`, AppModule.name);
}

bootstrap();
