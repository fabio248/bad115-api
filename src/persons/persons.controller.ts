import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PersonsService } from './services/persons.service';
import { CreatePersonDto } from './dtos/request/create-person.dto';
import { UpdatePersonDto } from './dtos/request/update-person.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('persons')
@ApiTags('Persons Endpoints')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.personsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personsService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personsService.remove(+id);
  }
}
