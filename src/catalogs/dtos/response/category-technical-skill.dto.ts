import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryTechnicalSkillDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
