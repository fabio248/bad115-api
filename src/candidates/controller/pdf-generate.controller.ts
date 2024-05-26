import { Param, Controller, Post, Res } from '@nestjs/common';
import { PdfGenerateService } from '../services/pdf-generate.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';

@Controller('candidates/:candidateId')
@ApiTags('Candidates Endpoints')
export class PdfGenerateController {
  constructor(private readonly pdfGenerateService: PdfGenerateService) {}
  @Post('/pdfs/')
  async generate(
    @Param() { candidateId }: CandidateIdDto,
    @Res() res: Response,
  ): Promise<void> {
    return this.pdfGenerateService.generate(res, candidateId);
  }
}
