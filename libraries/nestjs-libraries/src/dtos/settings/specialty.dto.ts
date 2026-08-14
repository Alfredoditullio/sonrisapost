import { IsIn, IsString } from 'class-validator';
import { DENTAL_SPECIALTIES } from '@gitroom/helpers/dental/dental.specialties';

const SLUGS = DENTAL_SPECIALTIES.map((s) => s.slug);

export class SpecialtyDto {
  @IsString()
  @IsIn(SLUGS)
  specialty: string;
}
