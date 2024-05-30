import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TechnicalSkillDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly categoryTechnicalSkillId: string;
}
