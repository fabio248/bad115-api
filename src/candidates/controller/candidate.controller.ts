import { Controller } from '@nestjs/common';
import { CandidateService } from '../services/candidate.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('candidate')
@ApiTags('Candidates Endpoints')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  //   findAll(@Param() { candidateId }: CandidateIdDto): Promise<> {}
}
