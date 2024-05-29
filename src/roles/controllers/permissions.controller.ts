import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from '../services/permissions.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PermissionDto } from '../dto/response/permission.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IdDto } from '../../common/dtos/request/id.dto';
import { CreatePermissionDto } from '../dto/request/create-permission.dto';
import { UpdatePermissionDto } from '../dto/request/update-permission.dto';

@ApiTags('Permissions Endpoint')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Auth({ permissions: [permissions.READ_PERMISSION.codename] })
  @ApiPaginatedResponse(PermissionDto)
  @Get('/paginated')
  async findAllPaginated(@Query() pageDto: PageDto) {
    return this.permissionsService.findAllPaginated(pageDto);
  }

  @Auth({ permissions: [permissions.READ_PERMISSION.codename] })
  @Get('')
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Auth({ permissions: [permissions.READ_PERMISSION.codename] })
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.permissionsService.findOne(id);
  }

  @Auth({ permissions: [permissions.CREATE_PERMISSION.codename] })
  @Post('')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Auth({ permissions: [permissions.UPDATE_PERMISSION.codename] })
  @Put(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Auth({ permissions: [permissions.DELETE_PERMISSION.codename] })
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.permissionsService.remove(id);
  }
}
