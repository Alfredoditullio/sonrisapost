import { IsIn, IsString } from 'class-validator';

/** Lugares donde puede vivir el banner. Cerrado a proposito: si crece sin
 * control, las metricas por placement dejan de ser comparables. */
export const PROMO_PLACEMENTS = ['sidebar', 'settings', 'calendar'] as const;

export class PromoClickDto {
  @IsString()
  @IsIn(PROMO_PLACEMENTS as unknown as string[])
  placement: string;
}
