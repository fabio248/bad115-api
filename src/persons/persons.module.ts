import { Module } from '@nestjs/common';
import { PersonsService } from './services/persons.service';
import { PersonsController } from './controllers/persons.controller';
import { AddressController } from './controllers/address.controller';
import { AddressesService } from './services/addresses.service';

@Module({
  controllers: [PersonsController, AddressController],
  providers: [PersonsService, AddressesService],
})
export class PersonsModule {}
