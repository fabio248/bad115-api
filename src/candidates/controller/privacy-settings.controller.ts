import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrivacySettingsService } from '../services/privacy-settings.service';
import { CandidateIdDto } from '../dto/request/candidate-id.dto';
import { CreatePrivacySettingsDto } from '../dto/request/create-privacy-settings.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { permissions } from 'prisma/seeds/permissions.seed';
import { PrivacySettingsDto } from '../dto/response/privacy-settings.dto';
import { PrivacySettingIdDto } from '../dto/request/privacy-settings-id.dto';

@Controller('candidates/:candidateId/privacy-settings')
@ApiTags('Candidates Endpoints')
export class PrivacySettingsController {
  constructor(
    private readonly privacySettingsService: PrivacySettingsService,
  ) {}

  @Post('')
  @Auth({ permissions: [permissions.UPDATE_CANDIDATE.codename] })
  update(
    @Param() { candidateId }: CandidateIdDto,
    @Body() createPrivacySettingsDto: CreatePrivacySettingsDto,
  ): Promise<void> {
    return this.privacySettingsService.update(
      candidateId,
      createPrivacySettingsDto,
    );
  }

  @Get('/:privacySettingId')
  @Auth({ permissions: [permissions.READ_CANDIDATE.codename] })
  findOne(
    @Param() { privacySettingId }: PrivacySettingIdDto,
  ): Promise<PrivacySettingsDto> {
    return this.privacySettingsService.findOne(privacySettingId);
  }
}
