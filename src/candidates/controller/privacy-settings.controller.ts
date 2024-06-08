import { Body, Controller, Param, Post } from '@nestjs/common';
import { PrivacySettingsService } from '../services/privacy-settings.service';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CreatePrivacySettingsDto } from '../dto/request/create-privacy-settings.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('candidates/:candidateId/privacy-settings')
@ApiTags('Candidates Endpoints')
export class PrivacySettingsController {
  constructor(
    private readonly privacySettingsService: PrivacySettingsService,
  ) {}
  @Post('')
  update(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createPrivacySettingsDto: CreatePrivacySettingsDto,
  ): Promise<void> {
    return this.privacySettingsService.update(
      candidateId,
      createPrivacySettingsDto,
    );
  }
}
