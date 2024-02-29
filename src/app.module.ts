import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaConfigService } from './common/services/prisma-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
