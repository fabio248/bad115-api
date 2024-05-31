import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from '../../../users/dtos/response/user.dto';
import { UnlockRequestStatusEnum } from '../../../auth/enums/unlock-request-status.enum';

@Exclude()
export class UnlockRequestDto {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => UserDto)
  readonly user: UserDto;

  @Expose()
  readonly status: UnlockRequestStatusEnum;

  @Expose()
  readonly reason?: string;
}
