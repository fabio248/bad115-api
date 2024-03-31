import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { PersonsService } from './services/persons.service';
import { UpdatePersonDto } from './dtos/request/update-person.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageDto } from '../common/dtos/request/page.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { PersonDto } from './dtos/response/person.dto';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { PersonIdDto } from './dtos/request/person-id.dto';

@Controller('persons')
@ApiTags('Persons Endpoints')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Auth()
  @ApiPaginatedResponse(PersonDto)
  @Get()
  findAll(@Query() pageDto: PageDto) {
    return this.personsService.findAll(pageDto);
  }

  @Auth()
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons',
    },
  ])
  @Get(':personId')
  findOne(@Param() { personId }: PersonIdDto) {
    return this.personsService.findOne(personId);
  }

  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons',
    },
  ])
  @Auth()
  @Put(':personId')
  update(
    @Param() { personId }: PersonIdDto,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personsService.update(personId, updatePersonDto);
  }

  @Auth()
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons',
    },
  ])
  @Delete(':personId')
  remove(@Param() { personId }: PersonIdDto) {
    return this.personsService.remove(personId);
  }
}
