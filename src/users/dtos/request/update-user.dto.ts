import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  loginAttemps?: number;

  @IsOptional()
  isActive?: boolean;
}
