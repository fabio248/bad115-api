import { Controller, Get, Param } from '@nestjs/common';
import { CandidateService } from '../services/candidate.service';
import { ApiTags } from '@nestjs/swagger';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CandidateDto } from '../dto/response/candidate.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';

@Controller('candidate')
@ApiTags('Candidates Endpoints')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('/:candidateId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(@Param() { candidateId }: CandidateIdDto): Promise<CandidateDto> {
    return this.candidateService.findOne(candidateId);
  }
}
