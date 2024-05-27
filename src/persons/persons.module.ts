import { Module } from '@nestjs/common';
import { PersonsService } from './services/persons.service';
import { PersonsController } from './controllers/persons.controller';
import { AddressController } from './controllers/address.controller';
import { AddressesService } from './services/addresses.service';
import { SocialNetworkController } from './controllers/socialnetwork.controller';
import { SocialNetworkService } from './services/socialnetwork.service';

@Module({
  controllers: [PersonsController, AddressController, SocialNetworkController],
  providers: [PersonsService, AddressesService, SocialNetworkService],
})
export class PersonsModule {}
