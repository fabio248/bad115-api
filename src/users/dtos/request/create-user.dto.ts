import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => bcrypt.hashSync(value, 10))
  readonly password: string;
}
