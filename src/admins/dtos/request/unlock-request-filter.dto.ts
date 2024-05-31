import { IsIn, IsOptional } from 'class-validator';
import { getSortOptions } from '../../../common/utils/sort.utils';
import { UnlockRequest } from '@prisma/client';
import { UnlockRequestStatusEnum } from '../../../auth/enums/unlock-request-status.enum';
import { Transform } from 'class-transformer';

export class UnlockRequestFilterDto {
  @IsOptional()
  @IsIn(getSortOptions<UnlockRequest>(['status', 'createdAt']))
  readonly sort?: string = 'createdAt-desc';

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  readonly status?: UnlockRequestStatusEnum[] | UnlockRequestStatusEnum = [];
}
