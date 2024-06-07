import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from '../../../persons/dtos/request/create-address.dto';

export class UpdateAddressDto extends PartialType(
  OmitType(CreateAddressDto, ['countryName']),
) {}
