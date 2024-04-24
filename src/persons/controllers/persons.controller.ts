import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  Put,
  Post,
} from '@nestjs/common';
import { PersonsService } from '../services/persons.service';
import { UpdatePersonDto } from '../dtos/request/update-person.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageDto } from '../../common/dtos/request/page.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { PersonDto } from '../dtos/response/person.dto';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { PersonIdDto } from '../dtos/request/person-id.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { CreateAddressDto } from '../dtos/request/create-address.dto';
import { PersonIncludeDto } from '../dtos/request/person-include.dto';

@Controller('persons')
@ApiTags('Persons Endpoints')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Auth({ permissions: [permissions.MANAGE_PERSON.codename] })
  @ApiPaginatedResponse(PersonDto)
  @Get()
  findAll(
    @Query() pageDto: PageDto,
    @Query() personIncludeDto: PersonIncludeDto,
  ): Promise<PaginatedDto<PersonDto>> {
    return this.personsService.findAll(pageDto, personIncludeDto);
  }

  @Auth({ permissions: [permissions.READ_PERSON.codename] })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons',
      description: 'El id de la persona no existe en la base de datos.',
    },
  ])
  @Get(':personId')
  findOne(
    @Param() { personId }: PersonIdDto,
    @Query() personIncludeDto: PersonIncludeDto,
  ): Promise<PersonDto> {
    return this.personsService.findOne(personId, personIncludeDto);
  }

  @Auth({ permissions: [permissions.UPDATE_PERSON.codename] })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons/{personId}',
    },
  ])
  @Put(':personId')
  update(
    @Param() { personId }: PersonIdDto,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personsService.update(personId, updatePersonDto);
  }

  @Auth({ permissions: [permissions.DELETE_PERSON.codename] })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons/{personId}',
    },
  ])
  @Delete(':personId')
  remove(@Param() { personId }: PersonIdDto): Promise<void> {
    return this.personsService.remove(personId);
  }

  @Auth({ permissions: [permissions.UPDATE_PERSON.codename] })
  @ApiErrorResponse([
    {
      status: HttpStatus.NOT_FOUND,
      message: 'Persona no encontrada.',
      errorType: 'Not Found',
      path: 'persons/{personId}/addresses',
    },
    {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'La dirección ya existe.',
      errorType: 'Unprocessable Entity',
      path: 'persons/{personId}/addresses',
    },
  ])
  @Post(':personId/addresses')
  addAddress(
    @Param() { personId }: PersonIdDto,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.personsService.addAddress(personId, createAddressDto);
  }
}
