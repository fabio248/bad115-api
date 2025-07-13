import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicationService } from '../services/publication.service';

// Dto's
import { CreatePublicationDto } from '../dto/request/create-publication.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { PublicationDto } from '../dto/response/publication.dto';
import { PublicationIdDto } from '../dto/request/publication-id.dto';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { PageDto } from '../../common/dtos/request/page.dto';
import { PaginatedDto } from '../../common/dtos/response/paginated.dto';
import { UpdatePublicationDto } from '../dto/request/update-publication.dto';
import { permissions } from 'prisma/seeds/permissions.seed';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('candidates/')
@ApiTags('Candidates Endpoints')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post(':candidateId/publication')
  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  create(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<PublicationDto> {
    return this.publicationService.create(candidateId, createPublicationDto);
  }

  @Get(':candidateId/publication/:publicationId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { publicationId }: PublicationIdDto,
  ): Promise<PublicationDto> {
    return this.publicationService.findOne(publicationId, candidateId);
  }

  @Get(':candidateId/publication/')
  @ApiPaginatedResponse(PublicationDto)
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findAll(
    @Param() { candidateId }: CandidateIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<PublicationDto>> {
    return this.publicationService.findAll(candidateId, pageDto);
  }

  @Put(':candidateId/publication/:publicationId')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  update(
    @Body() updatePublicationDto: UpdatePublicationDto,
    @Param() { candidateId }: CandidateIdDto,
    @Param() { publicationId }: PublicationIdDto,
  ): Promise<PublicationDto> {
    return this.publicationService.update(
      updatePublicationDto,
      publicationId,
      candidateId,
    );
  }
  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  @Delete(':candidateId/publication/:publicationId')
  remove(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { publicationId }: PublicationIdDto,
  ) {
    return this.publicationService.remove(publicationId, candidateId);
  }
}
