import { Module } from '@nestjs/common';
import { PersonsService } from './services/persons.service';
import { PersonsController } from './persons.controller';

@Module({
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonsModule {}
