import { Controller } from '@nestjs/common';
import { PdfsService } from '../services/pdfs.service';

@Controller('pdfs')
export class PdfsController {
  constructor(private readonly pdfsService: PdfsService) {}
}
