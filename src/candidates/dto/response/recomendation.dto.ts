import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { RecomendationEnum } from 'src/candidates/enums/recomendation-enum';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { Type } from 'class-transformer';

@Exclude()
export class RecomendationDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly type: RecomendationEnum;

  @Expose()
  readonly recomendation?: string;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => UserDto)
  readonly users?: UserDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
