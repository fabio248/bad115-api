import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PrivacySettingsDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly laboralExperiences: boolean;

  @Expose()
  readonly academicKnowledges: boolean;

  @Expose()
  readonly certifications: boolean;

  @Expose()
  readonly technicalSkills: boolean;

  @Expose()
  readonly languageSkills: boolean;

  @Expose()
  readonly recognitions: boolean;

  @Expose()
  readonly publications: boolean;

  @Expose()
  readonly participations: boolean;

  @Expose()
  readonly tests: boolean;

  @Expose()
  readonly recomendations: boolean;

  @Expose()
  readonly address: boolean;

  @Expose()
  readonly documents: boolean;

  @Expose()
  readonly socialNetwork: boolean;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
