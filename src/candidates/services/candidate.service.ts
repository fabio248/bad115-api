import { Injectable, Logger } from '@nestjs/common';
import { CandidateDto } from '../dto/response/candidate.dto';

@Injectable()
export class CandidateService {
  private readonly logger = new Logger(CandidateService.name);

  async findOne(id: string): Promise<CandidateDto> {
    this.logger.log(`Finding candidate with id: ${id}`);
    return;
  }
}
