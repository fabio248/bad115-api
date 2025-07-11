import { IsDateString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CandidateFilterByRangeDateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
