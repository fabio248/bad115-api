import { Module } from '@nestjs/common';
import { AdminsService } from './services/admins.service';
import { AdminsController } from './controllers/admins.controller';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
