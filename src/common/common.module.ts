import { Global, Module } from '@nestjs/common';
import { PrismaConfigService } from './services/prisma-config.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaConfigService],
  exports: [PrismaConfigService],
})
export class CommonModule {}
