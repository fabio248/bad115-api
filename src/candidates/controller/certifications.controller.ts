import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CertificationsService } from '../services/certifications.service';
import { CreateCertificationDto } from '../dto/request/create-certification.dto';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { permissions } from '../../../prisma/seeds/permissions.seed';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CertificationIdDto } from '../dto/request/certification-id.dto';
import { UpdateCertificationDto } from '../dto/request/update-certification.dto';

@Controller('candidates/:candidateId/certifications')
@ApiTags('Candidates Endpoints')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
  @Auth({ permissions: [permissions.CREATE_CANDIDATE.codename] })
  async create(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createCertificationDto: CreateCertificationDto,
  ) {
    return this.certificationsService.create({
      candidateId,
      createCertificationDto,
    });
  }

  @Get()
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  async find(@Param() { candidateId }: CandidateIdDto) {
    return this.certificationsService.find(candidateId);
  }

  @Get(':certificationId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  async findOne(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { certificationId }: CertificationIdDto,
  ) {
    return this.certificationsService.findOne(candidateId, certificationId);
  }

  @Put(':certificationId')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  async update(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { certificationId }: CertificationIdDto,
    @Body() createCertificationDto: UpdateCertificationDto,
  ) {
    return this.certificationsService.update(
      candidateId,
      certificationId,
      createCertificationDto,
    );
  }

  @Delete(':certificationId')
  @Auth({ permissions: [permissions.DELETE_CANDIDATE.codename] })
  async delete(
    @Param() { candidateId }: CandidateIdDto,
    @Param() { certificationId }: CertificationIdDto,
  ) {
    return this.certificationsService.delete(candidateId, certificationId);
  }
}
