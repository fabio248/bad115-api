import { Controller, Get, Param } from '@nestjs/common';
import { CandidateService } from '../services/candidate.service';
import { ApiTags } from '@nestjs/swagger';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CandidateDto } from '../dto/response/candidate.dto';

@Controller('candidate')
@ApiTags('Candidates Endpoints')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('/:candidateId')
  findOne(@Param() { candidateId }: CandidateIdDto): Promise<CandidateDto> {
    return this.candidateService.findOne(candidateId);
  }
}
