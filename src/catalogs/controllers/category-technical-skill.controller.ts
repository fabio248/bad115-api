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
import { TechnicalSkillService } from '../services/category-technical-skill.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryTechnicalSkillDto } from '../dtos/response/category-technical-skill.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { CategoryIdDto } from 'src/candidates/dto/request/category-id.dto';
import { TechnicalSkillDto } from '../dtos/response/technical-skill.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { CreateTechnicalSkillDto } from '../dtos/request/create-technical-skill.dto';
import { TechnicalSkillIdDto } from 'src/candidates/dto/request/technical-skill-id.dto';
import { UpdateTechnicalSkillTypeDto } from '../dtos/request/update-technical-skill.dto';
import { CreateCategoryDto } from 'src/candidates/dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';

@Controller('catalogs/technical-skills-candidate')
@ApiTags('Technical Skill Endpoints')
export class TechnicalSkillController {
  constructor(private readonly technicalSkillService: TechnicalSkillService) {}

  @Get('')
  @ApiOperation({
    summary: 'Use this endpoint to return all categories whithout paginated ',
  })
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAll(): Promise<CategoryTechnicalSkillDto[]> {
    return this.technicalSkillService.findAll();
  }

  @Get('technical-skills/category/:categoryId')
  @ApiOperation({
    summary: 'Use this endpoint to return all categories whithout paginated ',
  })
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllById(
    @Query() { categoryId }: CategoryIdDto,
  ): Promise<TechnicalSkillDto[]> {
    return this.technicalSkillService.findAllById(categoryId);
  }

  @ApiPaginatedResponse(CategoryTechnicalSkillDto)
  @ApiOperation({
    summary:
      'Use this endpoint to return all categories technical skill paginated ',
  })
  @Get('/paginated')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllPaginated(
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<CategoryTechnicalSkillDto>> {
    return this.technicalSkillService.findAllPaginated(pageDto);
  }

  @ApiPaginatedResponse(TechnicalSkillDto)
  @ApiOperation({
    summary: 'Use this endpoint to return all technical skill paginated ',
  })
  @Get('technical-skills/category/:categoryId/paginated')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllByIdPaginated(
    @Query() { categoryId }: CategoryIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillDto>> {
    return this.technicalSkillService.findAllByIdPaginated(categoryId, pageDto);
  }

  @Post('/technical-skill/category/:categoryId')
  @ApiOperation({ summary: 'Create a new technical skill' })
  @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  create(
    @Param() { categoryId }: CategoryIdDto,
    @Body() createTechnicalSkillDto: CreateTechnicalSkillDto,
  ): Promise<TechnicalSkillDto> {
    return this.technicalSkillService.create(
      categoryId,
      createTechnicalSkillDto,
    );
  }

  @Get('/technical-skill/:technicalSkillId')
  @ApiOperation({ summary: 'Find a technical skill - Only one technicalSkill' })
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findOne(
    @Param() { technicalSkillId }: TechnicalSkillIdDto,
  ): Promise<TechnicalSkillDto> {
    return this.technicalSkillService.findOne(technicalSkillId);
  }

  @Put('/technical-skill/:technicalSkillId')
  @ApiOperation({
    summary: 'Use this endpoint to Update informacio of technical Skill',
  })
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  update(
    @Param() { technicalSkillId }: TechnicalSkillIdDto,
    @Body() updateTechnicalSkillTypeDto: UpdateTechnicalSkillTypeDto,
  ): Promise<TechnicalSkillDto> {
    return this.technicalSkillService.update(
      technicalSkillId,
      updateTechnicalSkillTypeDto,
    );
  }

  @Delete('/technical-skill/:technicalSkillId')
  @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  @ApiOperation({
    summary: 'Use this endpoint to delete a technical skill',
  })
  remove(@Param() { technicalSkillId }: TechnicalSkillIdDto): Promise<void> {
    return this.technicalSkillService.remove(technicalSkillId);
  }

  @Post('/category')
  @ApiOperation({
    summary:
      'Use this endpoint to Create a new category for categories of candidate',
  })
  @Auth({ permissions: [permissions.CREATE_CATALOG.codename] })
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryTechnicalSkillDto> {
    return this.technicalSkillService.createCategory(createCategoryDto);
  }

  @Get('/category/:categoryId')
  @ApiOperation({ summary: 'Find a category - Only one category' })
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findOneCategory(
    @Param() { categoryId }: CategoryIdDto,
  ): Promise<CategoryTechnicalSkillDto> {
    return this.technicalSkillService.findOneCategory(categoryId);
  }

  @Put('/category/:categoryId')
  @ApiOperation({
    summary: 'Use this endpoint to Update information of category',
  })
  @Auth({ permissions: [permissions.UPDATE_CATALOG.codename] })
  updateCategory(
    @Param() { categoryId }: CategoryIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<TechnicalSkillDto> {
    return this.technicalSkillService.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete('/category/:categoryId')
  @Auth({ permissions: [permissions.DELETE_CATALOG.codename] })
  @ApiOperation({
    summary: 'Use this endpoint to delete a category',
  })
  removeCategory(@Param() { categoryId }: CategoryIdDto): Promise<void> {
    return this.technicalSkillService.removeCategory(categoryId);
  }

  @ApiPaginatedResponse(TechnicalSkillDto)
  @ApiOperation({
    summary: 'Use this endpoint to return all technical skill paginated',
  })
  @Get('technical-skills/paginated')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllTechnicalSkillPaginated(
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillDto>> {
    return this.technicalSkillService.findAllTechnicalSkillPaginated(pageDto);
  }
}
