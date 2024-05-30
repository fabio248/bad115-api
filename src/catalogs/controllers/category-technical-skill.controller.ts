import { Controller, Get, Query } from '@nestjs/common';
import { TechnicalSkillService } from '../services/category-technical-skill.service';
import { ApiTags } from '@nestjs/swagger';
import { CategoryTechnicalSkillDto } from '../dtos/response/category-technical-skill.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { CategoryIdDto } from 'src/candidates/dto/request/category-id.dto';
import { TechnicalSkillDto } from '../dtos/response/technical-skill.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';

@Controller('catalogs/technical-skill-candidate')
@ApiTags('Technical Skill Candidate Endpoints')
export class TechnicalSkillController {
  constructor(private readonly technicalSkillService: TechnicalSkillService) {}

  @Get('/category-technical-skill')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAll(): Promise<CategoryTechnicalSkillDto[]> {
    return this.technicalSkillService.findAll();
  }

  @Get('technical-skill/:categoryId')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllById(
    @Query() { categoryId }: CategoryIdDto,
  ): Promise<TechnicalSkillDto[]> {
    return this.technicalSkillService.findAllById(categoryId);
  }

  @Get('/category-technical-skill-paginated')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllPaginated(
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<CategoryTechnicalSkillDto>> {
    return this.technicalSkillService.findAllPaginated(pageDto);
  }

  @Get('technical-skill-paginated/:categoryId')
  @Auth({ permissions: [permissions.READ_CATALOG.codename] })
  findAllByIdPaginated(
    @Query() { categoryId }: CategoryIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<TechnicalSkillDto>> {
    return this.technicalSkillService.findAllByIdPaginated(categoryId, pageDto);
  }
}
