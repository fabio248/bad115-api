import { PartialType } from '@nestjs/swagger';
import { CreateSocialNetworkTypesDto } from './create-social-network-type.dto';

export class UpdateSocialNetworkTypesDto extends PartialType(
  CreateSocialNetworkTypesDto,
) {}
