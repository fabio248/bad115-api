import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { PersonDto } from 'src/persons/dtos/response/person.dto';
import { LaboralExperienceDto } from './laboral-experience.dto';
import { AcademicKnowledgeDto } from './academic-knowledge.dto';
import { TechnicalSkillDto } from 'src/catalogs/dtos/response/technical-skill.dto';
import { LanguageSkillDto } from './language-skill.dto';
import { RecognitionDto } from './recognition.dto';
import { PublicationDto } from './publication.dto';
import { ParticipationDto } from './participation.dto';
import { TestDto } from './test.dto';
import { RecomendationDto } from './recomendation.dto';
import { CertificationDto } from './certification.dto';
import { SocialNetworkDto } from 'src/persons/dtos/response/social-network.dto';

@Exclude()
export class CandidateDto {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => PersonDto)
  readonly person?: PersonDto;

  @Expose()
  @Type(() => LaboralExperienceDto)
  readonly laboralExperiences?: LaboralExperienceDto[];

  @Expose()
  @Type(() => SocialNetworkDto)
  readonly socialNetwork?: SocialNetworkDto[];

  @Expose()
  @Type(() => AcademicKnowledgeDto)
  readonly academicKnowledges?: AcademicKnowledgeDto[];

  @Expose()
  @Type(() => CertificationDto)
  readonly certifications?: CertificationDto[];

  @Expose()
  @Transform(({ value }) => {
    return plainToInstance(
      TechnicalSkillDto,
      value?.map((v) => v.technicalSkill),
    );
  })
  readonly technicalSkills?: TechnicalSkillDto[];

  @Expose()
  @Type(() => LanguageSkillDto)
  readonly languageSkills?: LanguageSkillDto[];

  @Expose()
  @Type(() => RecognitionDto)
  readonly recognitions?: RecognitionDto[];

  @Expose()
  @Type(() => PublicationDto)
  readonly publications?: PublicationDto[];

  @Expose()
  @Type(() => ParticipationDto)
  readonly participations?: ParticipationDto[];

  @Expose()
  @Type(() => TestDto)
  readonly tests?: TestDto[];

  @Expose()
  @Type(() => RecomendationDto)
  readonly recomendations?: RecomendationDto[];
}
